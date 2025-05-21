import { useCallback, useRef } from "react";
import { Edit, Trash } from "lucide-react";

import { EstablishmentType } from "@/core/entities/establishment-type.entity";
import { PaginatedResult } from "@/core/entities/pagination";
import { Button } from "@/presentation/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";

export function EstablishmentTypeList({
    onEdit,
    onDelete,
}: {
    onEdit: (establishmentType: EstablishmentType) => void;
    onDelete: (establishmentType: EstablishmentType) => void;
}) {
    const fetchEstablishmentTypes = async ({
        pageParam = 1,
    }): Promise<PaginatedResult<EstablishmentType>> => {
        const res = await fetch(
            `/api/establishment-types?page=${pageParam}&per_page=5`
        );

        return res.json();
    };
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ["establishment-types"],
        queryFn: fetchEstablishmentTypes,
        getNextPageParam: (lastPage: PaginatedResult<EstablishmentType>) =>
            lastPage.nextPage ? lastPage.nextPage : undefined,
        initialPageParam: 1,
    });
    const observer = useRef<IntersectionObserver | null>(null);
    const lastEstablishmentTypeRef = useCallback(
        (node: HTMLElement | null) => {
            if (isFetchingNextPage) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            });
            if (node) observer.current.observe(node);
        },
        [isFetchingNextPage, fetchNextPage, hasNextPage]
    );

    return (
        <div className="max-h-full space-y-2 overflow-auto">
            {data?.pages.map((page, i) =>
                page.items.map(
                    (establishmentType: EstablishmentType, idx: number) => {
                        const isLast =
                            i === data.pages.length - 1 &&
                            idx === page.items.length - 1;

                        return (
                            <div
                                key={establishmentType.id}
                                ref={
                                    isLast
                                        ? lastEstablishmentTypeRef
                                        : undefined
                                }
                                className="flex items-center justify-between rounded border p-2"
                            >
                                <div>
                                    <div className="font-bold">
                                        {establishmentType.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {establishmentType.description}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() =>
                                            onEdit(establishmentType)
                                        }
                                    >
                                        <Edit className="size-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        onClick={() =>
                                            onDelete(establishmentType)
                                        }
                                    >
                                        <Trash className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    }
                )
            )}
            {isFetchingNextPage && <div>Chargement...</div>}
        </div>
    );
}
