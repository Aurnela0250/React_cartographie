"use client";

import Link from "next/link";
import { Edit, Search, Trash } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import type { City } from "@/core/entities/city.entity";
import type { EstablishmentType } from "@/core/entities/establishment-type.entity";
import type { Establishment } from "@/core/entities/establishment.entity";
import type { PaginatedResult } from "@/core/entities/pagination";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/presentation/components/ui/table";
import { useDebounce } from "@/presentation/hooks/use-debounce";
import { fetchWithAutoRefresh } from "@/shared/utils/fetch-with-refresh";
import { useQuery } from "@tanstack/react-query";

import { EstablishmentListSkeleton } from "./establishment-list-skeleton";
import { useEstablishmentStore } from "./establishment-store";

export function EstablishmentList() {
    const { openForEdit, openForDelete } = useEstablishmentStore();

    const [{ page, name, type, city }, setQuery] = useQueryStates({
        page: parseAsInteger.withDefault(1),
        name: parseAsString.withDefault(""),
        type: parseAsString.withDefault("all"),
        city: parseAsString.withDefault("all"),
    });
    const debouncedName = useDebounce(name, 500);

    // Récupérer les types d'établissement et les villes pour les filtres
    const { data: types } = useQuery<EstablishmentType[]>({
        queryKey: ["establishment-types", "all"],
        queryFn: async () => {
            const res = await fetchWithAutoRefresh(
                "/api/establishment-types?page=1&per_page=100"
            );
            const json = await res.json();
            return json.items || [];
        },
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
    });
    const { data: cities } = useQuery<City[]>({
        queryKey: ["cities", "all"],
        queryFn: async () => {
            const res = await fetchWithAutoRefresh(
                "/api/cities?page=1&per_page=100"
            );
            const json = await res.json();
            return json.items || [];
        },
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
    });

    // Utiliser l'endpoint filter pour les établissements
    const fetchFilteredEstablishments = async (): Promise<
        PaginatedResult<Establishment>
    > => {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: "10",
        });
        if (debouncedName) {
            params.set("name", debouncedName);
        }
        if (type !== "all") {
            params.set("establishmentTypeId", type);
        }
        if (city !== "all") {
            params.set("cityId", city);
        }
        const res = await fetchWithAutoRefresh(
            `/api/establishments/filter?${params.toString()}`
        );
        if (!res.ok) {
            throw new Error("Failed to fetch establishments");
        }
        return res.json();
    };

    const { data, isLoading } = useQuery<PaginatedResult<Establishment>>({
        queryKey: ["establishments", page, debouncedName, type, city],
        queryFn: fetchFilteredEstablishments,
        placeholderData: (previousData) => previousData,
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
    });

    return (
        <>
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                        className="w-full rounded-lg bg-background pl-8"
                        placeholder="Rechercher un établissement par nom..."
                        type="search"
                        value={name}
                        onChange={(e) =>
                            setQuery({ name: e.target.value, page: 1 })
                        }
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="rounded border px-2 py-1 text-sm"
                        value={type}
                        onChange={(e) =>
                            setQuery({ type: e.target.value, page: 1 })
                        }
                    >
                        <option value="all">Tous les types</option>
                        {types?.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                    <select
                        className="rounded border px-2 py-1 text-sm"
                        value={city}
                        onChange={(e) =>
                            setQuery({ city: e.target.value, page: 1 })
                        }
                    >
                        <option value="all">Toutes les villes</option>
                        {cities?.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="rounded-md border p-2">
                <div className="relative max-h-[60vh] overflow-auto">
                    <Table>
                        <TableHeader className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Nom</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Ville</TableHead>
                                <TableHead>Adresse</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <EstablishmentListSkeleton />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.items.map(
                                    (establishment: Establishment) => {
                                        const typeName =
                                            types?.find(
                                                (t) =>
                                                    t.id ===
                                                    establishment.establishmentTypeId
                                            )?.name ||
                                            `Type #${establishment.establishmentTypeId}`;
                                        const cityName =
                                            cities?.find(
                                                (c) =>
                                                    c.id ===
                                                    establishment.cityId
                                            )?.name ||
                                            `Ville #${establishment.cityId}`;
                                        return (
                                            <TableRow
                                                key={establishment.id}
                                                className="transition-colors hover:bg-muted/50"
                                            >
                                                <TableCell className="font-medium">
                                                    <Link
                                                        href={`/admin/establishments/${establishment.id}/formations`}
                                                        className="underline-offset-2 hover:underline"
                                                    >
                                                        {establishment.name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    {typeName}
                                                </TableCell>
                                                <TableCell>
                                                    {cityName}
                                                </TableCell>
                                                <TableCell>
                                                    {establishment.address ||
                                                        "-"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="inline-flex gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            onClick={() =>
                                                                openForEdit(
                                                                    establishment
                                                                )
                                                            }
                                                        >
                                                            <Edit className="size-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                openForDelete(
                                                                    establishment
                                                                )
                                                            }
                                                        >
                                                            <Trash className="size-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }
                                )
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Total de {data?.totalItems ?? 0} établissements
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        disabled={!data?.previousPage}
                        size="sm"
                        variant="outline"
                        onClick={() => setQuery({ page: page - 1 })}
                    >
                        Précédent
                    </Button>
                    <span className="text-sm font-medium">
                        Page {page} sur {data?.totalPages ?? 1}
                    </span>
                    <Button
                        disabled={!data?.nextPage}
                        size="sm"
                        variant="outline"
                        onClick={() => setQuery({ page: page + 1 })}
                    >
                        Suivant
                    </Button>
                </div>
            </div>
        </>
    );
}
