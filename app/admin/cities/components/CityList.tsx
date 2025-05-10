import { useCallback, useRef } from "react";
import { Edit, Trash } from "lucide-react";

import { City } from "@/core/domain/entities/city.entity";
import { PaginatedResult } from "@/core/domain/entities/pagination";
import { Region } from "@/core/domain/entities/region.entity";
import { Button } from "@/presentation/components/ui/button";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function CityList({
    onEdit,
    onDelete,
}: {
    onEdit: (city: City) => void;
    onDelete: (city: City) => void;
}) {
    // Récupérer la liste des régions pour affichage du nom
    const { data: regions } = useQuery<Region[]>({
        queryKey: ["regions", "all"],
        queryFn: async () => {
            const res = await fetch("/api/regions?page=1&per_page=100");
            const json = await res.json();

            return Array.isArray(json) ? json : json.items || [];
        },
    });
    const fetchCities = async ({
        pageParam = 1,
    }: {
        pageParam?: number;
    }): Promise<PaginatedResult<City>> => {
        const res = await fetch(`/api/cities?page=${pageParam}&per_page=5`);

        if (!res.ok) {
            throw new Error("Failed to fetch cities");
        }

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
    } = useInfiniteQuery<PaginatedResult<City>>({
        queryKey: ["cities"],
        queryFn: (context) =>
            fetchCities({ pageParam: (context.pageParam as number) ?? 1 }),
        getNextPageParam: (lastPage: PaginatedResult<City>) =>
            lastPage.nextPage ? lastPage.nextPage : undefined,
        initialPageParam: 1,
    });
    const observer = useRef<IntersectionObserver | null>(null);
    const lastCityRef = useCallback(
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

    if (isFetching && !data) {
        return <p>Chargement des villes...</p>;
    }

    if (isError && error) {
        return <p>Erreur lors du chargement des villes: {error.message}</p>;
    }

    const cities = data?.pages.flatMap((page) => page.items) || [];

    if (cities.length === 0) {
        return <p>Aucune ville trouvée.</p>;
    }

    return (
        <div className="max-h-full space-y-2 overflow-auto">
            {data?.pages.map((page, i) =>
                page.items.map((city, idx) => {
                    const isLast =
                        i === data.pages.length - 1 &&
                        idx === page.items.length - 1;

                    // Chercher le nom de la région correspondant
                    const regionName =
                        regions?.find((r) => r.id === city.regionId)?.name ||
                        `ID: ${city.regionId}`;

                    return (
                        <div
                            key={city.id}
                            ref={isLast ? lastCityRef : undefined}
                            className="flex items-center justify-between rounded border p-2"
                        >
                            <div>
                                <div className="font-bold">{city.name}</div>
                                <div className="text-xs text-gray-500">
                                    Région : {regionName}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => onEdit(city)}
                                >
                                    <Edit className="size-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => onDelete(city)}
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
