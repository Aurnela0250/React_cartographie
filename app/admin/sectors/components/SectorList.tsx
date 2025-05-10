import { useCallback, useRef } from "react";
import { Edit, Trash } from "lucide-react";

import { PaginatedResult } from "@/core/domain/entities/pagination";
import { Sector } from "@/core/domain/entities/sector.entity";
import { Button } from "@/presentation/components/ui/button";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function SectorList({
    onEdit,
    onDelete,
}: {
    onEdit: (sector: Sector) => void;
    onDelete: (sector: Sector) => void;
}) {
    const fetchSectors = async ({
        pageParam = 1,
    }): Promise<PaginatedResult<Sector>> => {
        const res = await fetch(`/api/sectors?page=${pageParam}&per_page=5`);

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
        queryKey: ["sectors"],
        queryFn: fetchSectors,
        getNextPageParam: (lastPage: PaginatedResult<Sector>) =>
            lastPage.nextPage ? lastPage.nextPage : undefined,
        initialPageParam: 1,
    });

    // Récupérer la liste des villes pour affichage du nom
    const { data: cities } = useQuery<{ id: number; name: string }[]>({
        queryKey: ["cities", "all"],
        queryFn: async () => {
            const res = await fetch("/api/cities?page=1&per_page=100");
            const json = await res.json();

            return json.items || [];
        },
    });

    const observer = useRef<IntersectionObserver | null>(null);
    const lastSectorRef = useCallback(
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
                page.items.map((sector: Sector, idx: number) => {
                    const isLast =
                        i === data.pages.length - 1 &&
                        idx === page.items.length - 1;

                    // Chercher le nom de la ville correspondante
                    const cityName =
                        cities?.find((c) => c.id === sector.cityId)?.name ||
                        `ID: ${sector.cityId}`;

                    return (
                        <div
                            key={sector.id}
                            ref={isLast ? lastSectorRef : undefined}
                            className="flex items-center justify-between rounded border p-2"
                        >
                            <div>
                                <div className="font-bold">{sector.name}</div>
                                <div className="text-xs text-gray-500">
                                    Ville : {cityName}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => onEdit(sector)}
                                >
                                    <Edit className="size-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => onDelete(sector)}
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
