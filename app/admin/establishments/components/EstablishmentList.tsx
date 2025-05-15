import { useCallback, useRef } from "react";
import Link from "next/link";
import { Edit, Trash } from "lucide-react";

import { IEstablishmentType } from "@/core/entities/establishment-type.entity";
import { Establishment } from "@/core/entities/establishment.entity";
import { ISector } from "@/core/entities/sector.entity";
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

                    const handleButtonClick = (
                        e: React.MouseEvent,
                        action: () => void
                    ) => {
                        e.preventDefault();
                        e.stopPropagation();
                        action();
                    };

                    return (
                        <Link
                            key={establishment.id}
                            ref={isLast ? lastEstablishmentRef : undefined}
                            className="block cursor-pointer rounded border p-3 transition-shadow duration-150 ease-in-out hover:bg-gray-50 hover:shadow-sm"
                            href={`/admin/establishments/${establishment.id}/formations`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="grow overflow-hidden pr-4">
                                    <div className="truncate font-bold">
                                        {establishment.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {typeName} | {sectorName}
                                    </div>
                                    <div className="truncate text-xs text-muted-foreground">
                                        {establishment.address ||
                                            "Adresse non spécifiée"}
                                    </div>
                                </div>
                                <div className="flex shrink-0 gap-2">
                                    <Button
                                        aria-label={`Modifier ${establishment.name}`}
                                        size="icon"
                                        variant="outline"
                                        onClick={(e) => {
                                            handleButtonClick(e, () =>
                                                onEdit(establishment)
                                            );
                                        }}
                                    >
                                        <Edit className="size-4" />
                                    </Button>
                                    <Button
                                        aria-label={`Supprimer ${establishment.name}`}
                                        size="icon"
                                        variant="destructive"
                                        onClick={(e) => {
                                            handleButtonClick(e, () =>
                                                onDelete(establishment)
                                            );
                                        }}
                                    >
                                        <Trash className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        </Link>
                    );
                })
            )}
            {isFetchingNextPage && (
                <div className="p-3 text-center text-sm text-muted-foreground">
                    Chargement...
                </div>
            )}
        </div>
    );
}
