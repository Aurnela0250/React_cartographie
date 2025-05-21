// MODIFIÉ: Version corrigée du scroll infini
import { useCallback, useRef } from "react";
import { Edit, Trash } from "lucide-react";

import { PaginatedResult } from "@/core/entities/pagination";
import { Region } from "@/core/entities/region.entity";
import { Button } from "@/presentation/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";

export function RegionList({
    onEdit,
    onDelete,
}: {
    onEdit: (region: Region) => void;
    onDelete: (region: Region) => void;
}) {
    const fetchRegions = async ({
        pageParam = 1,
    }): Promise<PaginatedResult<Region>> => {
        const res = await fetch(`/api/regions?page=${pageParam}&per_page=10`);

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

    // Nouvelle implémentation de l'IntersectionObserver
    const observer = useRef<IntersectionObserver | null>(null);
    const lastRegionRef = useCallback(
        (node: HTMLElement | null) => {
            if (isFetchingNextPage) return;

            // Détacher l'observateur précédent s'il existe
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (
                        entries[0].isIntersecting &&
                        hasNextPage &&
                        !isFetchingNextPage
                    ) {
                        fetchNextPage();
                    }
                },
                { threshold: 0.1 } // Déclenche quand 10% de l'élément est visible
            );

            if (node) observer.current.observe(node);
        },
        [isFetchingNextPage, hasNextPage, fetchNextPage]
    );

    return (
        <div className="max-h-full space-y-2 overflow-auto">
            {data?.pages.map((page, i) =>
                page.items.map((region: Region, idx: number) => {
                    // Vérifie si c'est le dernier élément de la dernière page
                    const isLastElement =
                        i === data.pages.length - 1 &&
                        idx === page.items.length - 1;

                    return (
                        <div
                            key={region.id}
                            ref={isLastElement ? lastRegionRef : null}
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

            {isFetchingNextPage && (
                <div className="p-4 text-center text-muted-foreground">
                    Chargement des régions...
                </div>
            )}

            {!hasNextPage && !isFetching && (
                <div className="p-4 text-center text-muted-foreground">
                    Fin de la liste des régions
                </div>
            )}
        </div>
    );
}
