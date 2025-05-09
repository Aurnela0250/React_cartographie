// MODIFIÉ: Ajout des imports pour les icônes

import { useCallback, useRef } from "react";
import { Edit, Trash } from "lucide-react";

import { PaginatedResult } from "@/core/domain/entities/pagination";
import { Region } from "@/core/domain/entities/region.entity";
import { Button } from "@/presentation/components/ui/button";
// MODIFIÉ: Ajout de l'import pour le composant Button
import { useInfiniteQuery } from "@tanstack/react-query";

export function RegionList({
    onEdit,
    onDelete,
}: {
    onEdit: (region: Region) => void;
    onDelete: (region: Region) => void;
}) {
    // Ajout du paramètre per_page=10 pour la pagination
    const fetchRegions = async ({
        pageParam = 1,
    }): Promise<PaginatedResult<Region>> => {
        const res = await fetch(`/api/regions?page=${pageParam}&per_page=5`);

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
        queryKey: ["regions"],
        queryFn: fetchRegions,
        getNextPageParam: (lastPage: PaginatedResult<Region>) =>
            lastPage.nextPage ? lastPage.nextPage : undefined,
        initialPageParam: 1,
    });

    // Correction: observer ne doit pas déclencher au premier rendu, mais seulement quand on scroll jusqu'au dernier élément
    const observer = useRef<IntersectionObserver | null>(null);
    const lastRegionRef = useCallback(
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
                page.items.map((region: Region, idx: number) => {
                    const isLast =
                        i === data.pages.length - 1 &&
                        idx === page.items.length - 1;

                    return (
                        <div
                            key={region.id}
                            ref={isLast ? lastRegionRef : undefined}
                            className="flex items-center justify-between rounded border p-2"
                        >
                            <div>
                                <div className="font-bold">{region.name}</div>
                                <div className="text-xs text-gray-500">
                                    {region.code}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => onEdit(region)}
                                >
                                    <Edit className="size-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => onDelete(region)}
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
