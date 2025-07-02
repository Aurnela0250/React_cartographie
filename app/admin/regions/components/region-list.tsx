"use client";

import { Edit, Search, Trash } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import type { PaginatedResult } from "@/core/entities/pagination";
import type { Region } from "@/core/entities/region.entity";
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

import { RegionListSkeleton } from "./region-list-skeleton";
import { useRegionStore } from "./region-store";

export function RegionList() {
    const setSelectedRegion = useRegionStore((s) => s.setSelectedRegion);
    const setIsAddEditDialogOpen = useRegionStore(
        (s) => s.setIsAddEditDialogOpen
    );
    const setDeleteRegionData = useRegionStore((s) => s.setDeleteRegionData);
    const setIsDeleteDialogOpen = useRegionStore(
        (s) => s.setIsDeleteDialogOpen
    );

    const [{ page, name }, setQuery] = useQueryStates({
        page: parseAsInteger.withDefault(1),
        name: parseAsString.withDefault(""),
    });

    const debouncedName = useDebounce(name, 500);

    const fetchFilteredRegions = async (): Promise<PaginatedResult<Region>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: "10",
        });

        if (debouncedName) {
            params.set("name", debouncedName);
        }
        const init: RequestInit = {
            method: "GET",
        };
        const res = await fetchWithAutoRefresh(
            `/api/regions/filter?${params.toString()}`,
            init
        );

        if (!res.ok) {
            throw new Error("Failed to fetch regions");
        }

        return res.json();
    };

    const { data, isLoading, isError, error, isFetching, isPlaceholderData } =
        useQuery<PaginatedResult<Region>>({
            queryKey: ["regions", page, debouncedName],
            queryFn: fetchFilteredRegions,
            placeholderData: (previousData) => previousData,
            staleTime: 1000 * 60 * 60 * 24,
            gcTime: 1000 * 60 * 60 * 24,
        });

    if (isLoading) {
        return <RegionListSkeleton />;
    }

    if (isError) {
        return (
            <div className="text-red-500">
                Erreur:{" "}
                {error instanceof Error
                    ? error.message
                    : "Une erreur est survenue"}
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                    className="w-full rounded-lg bg-background pl-8 md:w-1/3"
                    placeholder="Rechercher une région par nom..."
                    type="search"
                    value={name}
                    onChange={(e) =>
                        setQuery({ name: e.target.value, page: 1 })
                    }
                />
            </div>

            <div className="rounded-md border">
                <div className="relative max-h-[60vh] overflow-auto">
                    <Table>
                        <TableHeader className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Nom</TableHead>
                                <TableHead>Date de création</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isFetching && isPlaceholderData ? (
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <RegionListSkeleton />
                                    </TableCell>
                                </TableRow>
                            ) : data?.items.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        className="p-4 text-center text-muted-foreground"
                                        colSpan={3}
                                    >
                                        Aucune région trouvée.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.items.map((region: Region) => (
                                    <TableRow
                                        key={region.id}
                                        className="transition-colors hover:bg-muted/50"
                                    >
                                        <TableCell className="font-medium">
                                            {region.name}
                                        </TableCell>
                                        <TableCell>
                                            {region.createdAt
                                                ? new Date(
                                                      region.createdAt
                                                  ).toLocaleDateString(
                                                      "fr-FR",
                                                      {
                                                          day: "2-digit",
                                                          month: "long",
                                                          year: "numeric",
                                                      }
                                                  )
                                                : "N/A"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="inline-flex gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedRegion(
                                                            region
                                                        );
                                                        setIsAddEditDialogOpen(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <Edit className="size-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        setDeleteRegionData(
                                                            region
                                                        );
                                                        setIsDeleteDialogOpen(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <Trash className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Total de {data?.totalItems ?? 0} régions
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
        </div>
    );
}
