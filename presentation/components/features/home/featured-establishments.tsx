"use client";

import Link from "next/link";

import { Establishment } from "@/core/entities/establishment.entity";
import { EstablishmentCard } from "@/presentation/components/features/establishments/establishment-card";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

async function fetchFeaturedEstablishments(): Promise<Establishment[]> {
    const params = new URLSearchParams();

    params.append("page", "1");
    params.append("per_page", "4");

    const response = await fetch(
        `/api/establishments/filter?${params.toString()}`
    );

    if (!response.ok) {
        throw new Error(
            "Erreur lors de la récupération des établissements à la une"
        );
    }

    const data = await response.json();

    return data.items || [];
}

export function FeaturedEstablishments() {
    const {
        data: establishments = [],
        isLoading,
        isError,
    } = useQuery<Establishment[]>({
        queryKey: ["featuredEstablishments"],
        queryFn: fetchFeaturedEstablishments,
    });

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Établissements à la une</h2>
                <Button asChild variant="ghost">
                    <Link href="/establishments">Voir tous</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <Card
                            key={`skeleton-${index}`}
                            className="overflow-hidden"
                        >
                            <Skeleton className="h-40 w-full" />
                            <CardContent className="p-4">
                                <div className="mb-2 flex items-start justify-between">
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-5 w-10" />
                                </div>
                                <Skeleton className="mb-1 h-6 w-3/4" />
                                <Skeleton className="mb-2 h-4 w-2/3" />
                                <Skeleton className="mb-4 h-4 w-1/2" />
                                <Skeleton className="h-9 w-full" />
                            </CardContent>
                        </Card>
                    ))
                ) : isError ? (
                    <div className="col-span-1 py-8 text-center md:col-span-2 lg:col-span-4">
                        <p className="text-destructive">
                            Erreur lors du chargement des établissements.
                        </p>
                    </div>
                ) : establishments.length > 0 ? (
                    establishments.map((establishment) => (
                        <EstablishmentCard
                            key={establishment.id}
                            establishment={establishment}
                        />
                    ))
                ) : (
                    <div className="col-span-1 py-8 text-center md:col-span-2 lg:col-span-4">
                        <p className="text-muted-foreground">
                            Aucun établissement à la une trouvé.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
