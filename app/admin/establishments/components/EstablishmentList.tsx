import { useCallback, useRef } from "react";
import { Edit, Trash } from "lucide-react";

import { IEstablishmentType } from "@/core/domain/entities/establishment-type.entity";
import { Establishment } from "@/core/domain/entities/establishment.entity";
import { ISector } from "@/core/domain/entities/sector.entity";
import { Button } from "@/presentation/components/ui/button";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function EstablishmentList({
    onEdit,
    onDelete,
}: {
    onEdit: (establishment: Establishment) => void;
    onDelete: (establishment: Establishment) => void;
}) {
    const fetchEstablishments = async ({ pageParam = 1 }) => {
        const res = await fetch(
            `/api/establishments?page=${pageParam}&per_page=10`
        );

        return res.json();
    };

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["establishments"],
            queryFn: fetchEstablishments,
            getNextPageParam: (lastPage) =>
                lastPage.nextPage ? lastPage.nextPage : undefined,
            initialPageParam: 1,
        });

    const observer = useRef<IntersectionObserver | null>(null);
    const lastEstablishmentRef = useCallback(
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

    // Récupérer les types et secteurs pour affichage
    const { data: types } = useQuery({
        queryKey: ["establishment-types", "all"],
        queryFn: async () => {
            const res = await fetch(
                "/api/establishment-types?page=1&per_page=100"
            );
            const json = await res.json();

            return json.items || [];
        },
    });
    const { data: sectors } = useQuery({
        queryKey: ["sectors", "all"],
        queryFn: async () => {
            const res = await fetch("/api/sectors?page=1&per_page=100");
            const json = await res.json();

            return json.items || [];
        },
    });

    return (
        <div className="max-h-full space-y-2 overflow-auto">
            {data?.pages.map((page, i) =>
                page.items.map((establishment: Establishment, idx: number) => {
                    const isLast =
                        i === data.pages.length - 1 &&
                        idx === page.items.length - 1;
                    const typeName =
                        types?.find(
                            (t: IEstablishmentType) =>
                                t.id === establishment.establishmentTypeId
                        )?.name || `Type #${establishment.establishmentTypeId}`;
                    const sectorName =
                        sectors?.find(
                            (s: ISector) => s.id === establishment.sectorId
                        )?.name || `Secteur #${establishment.sectorId}`;

                    return (
                        <div
                            key={establishment.id}
                            ref={isLast ? lastEstablishmentRef : undefined}
                            className="flex items-center justify-between rounded border p-2"
                        >
                            <div>
                                <div className="font-bold">
                                    {establishment.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {typeName} | {sectorName}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {establishment.address}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => onEdit(establishment)}
                                >
                                    <Edit className="size-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => onDelete(establishment)}
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
