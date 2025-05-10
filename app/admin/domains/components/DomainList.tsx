import { useCallback, useRef } from "react";
import { Edit, Trash } from "lucide-react";

import { Domain } from "@/core/domain/entities/domain.entity";
import { PaginatedResult } from "@/core/domain/entities/pagination";
import { Button } from "@/presentation/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";

export function DomainList({
    onEdit,
    onDelete,
}: {
    onEdit: (domain: Domain) => void;
    onDelete: (domain: Domain) => void;
}) {
    const fetchDomains = async ({
        pageParam = 1,
    }): Promise<PaginatedResult<Domain>> => {
        const res = await fetch(`/api/domains?page=${pageParam}&per_page=5`);

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
        queryKey: ["domains"],
        queryFn: fetchDomains,
        getNextPageParam: (lastPage: PaginatedResult<Domain>) =>
            lastPage.nextPage ? lastPage.nextPage : undefined,
        initialPageParam: 1,
    });

    const observer = useRef<IntersectionObserver | null>(null);
    const lastDomainRef = useCallback(
        (node: HTMLElement | null) => {
            if (isFetchingNextPage) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(
                (entries: IntersectionObserverEntry[]) => {
                    if (
                        entries[0].isIntersecting &&
                        hasNextPage &&
                        !isFetchingNextPage
                    ) {
                        fetchNextPage();
                    }
                },
                { threshold: 1.0 }
            );
            if (node) observer.current.observe(node);
        },
        [isFetchingNextPage, fetchNextPage, hasNextPage]
    );

    return (
        <div className="max-h-full space-y-2 overflow-auto">
            {data?.pages.map((page, i) =>
                page.items.map((domain: Domain, idx: number) => {
                    const isLast =
                        i === data.pages.length - 1 &&
                        idx === page.items.length - 1;

                    return (
                        <div
                            key={domain.id}
                            ref={isLast ? lastDomainRef : undefined}
                            className="flex items-center justify-between rounded border p-2"
                        >
                            <div>
                                <div className="font-bold">{domain.name}</div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => onEdit(domain)}
                                >
                                    <Edit className="size-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => onDelete(domain)}
                                >
                                    <Trash className="size-4" />
                                </Button>
                            </div>
                        </div>
                    );
                })
            )}
            {isFetchingNextPage && <div>Chargement...</div>}
        </div>
    );
}
