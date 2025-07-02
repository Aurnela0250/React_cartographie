"use client";

import { Edit, Search, Trash } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import type { City } from "@/core/entities/city.entity";
import type { PaginatedResult } from "@/core/entities/pagination";
import type { Region } from "@/core/entities/region.entity";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/presentation/components/ui/select";
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

import { CityListSkeleton } from "./city-list-skeleton";
import { useCityStore } from "./city-store";

export function CityList() {
    const setSelectedCity = useCityStore((s) => s.setSelectedCity);
    const setIsAddEditDialogOpen = useCityStore(
        (s) => s.setIsAddEditDialogOpen
    );

    const setIsDeleteDialogOpen = useCityStore((s) => s.setIsDeleteDialogOpen);

    const [{ page, name, regionId: regionIdStr }, setQuery] = useQueryStates({
        page: parseAsInteger.withDefault(1),
        name: parseAsString.withDefault(""),
        regionId: parseAsString.withDefault("all"),
    });
    const debouncedName = useDebounce(name, 500);

    // Récupérer la liste des régions (cache 24h)
    const { data: regions, isLoading: isLoadingRegions } = useQuery<Region[]>({
        queryKey: ["regions", "all"],
        queryFn: async () => {
            const res = await fetchWithAutoRefresh(
                "/api/regions?page=1&per_page=100"
            );
            const json = await res.json();

            return Array.isArray(json) ? json : json.items || [];
        },
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
    });

    // Utiliser l'endpoint filter pour les villes
    const fetchFilteredCities = async (): Promise<PaginatedResult<City>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: "10",
        });

        if (debouncedName) {
            params.set("name", debouncedName);
        }
        if (regionIdStr !== "all") {
            params.set("regionId", regionIdStr);
        }
        const init: RequestInit = { method: "GET" };
        const res = await fetchWithAutoRefresh(
            `/api/cities/filter?${params.toString()}`,
            init
        );

        if (!res.ok) {
            throw new Error("Failed to fetch cities");
        }

        return res.json();
    };

    const { data } = useQuery<PaginatedResult<City>>({
        queryKey: ["cities", page, debouncedName, regionIdStr],
        queryFn: fetchFilteredCities,
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
                        placeholder="Rechercher une ville par nom..."
                        type="search"
                        value={name}
                        onChange={(e) =>
                            setQuery({ name: e.target.value, page: 1 })
                        }
                    />
                </div>
                <div className="w-full md:w-1/3">
                    <Select
                        disabled={isLoadingRegions}
                        value={regionIdStr}
                        onValueChange={(value) =>
                            setQuery({ regionId: value, page: 1 })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filtrer par région" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Toutes les régions
                            </SelectItem>
                            {regions?.map((region) => (
                                <SelectItem
                                    key={region.id}
                                    value={region.id!.toString()}
                                >
                                    {region.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="rounded-md border p-2">
                <div className="relative max-h-[60vh] overflow-auto">
                    <Table>
                        <TableHeader className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Nom</TableHead>
                                <TableHead>Région</TableHead>
                                <TableHead>Date de création</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoadingRegions ? (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <CityListSkeleton />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.items.map((city: City) => {
                                    const regionName =
                                        regions?.find(
                                            (r) => r.id === city.regionId
                                        )?.name || `ID: ${city.regionId}`;

                                    return (
                                        <TableRow
                                            key={city.id}
                                            className="transition-colors hover:bg-muted/50"
                                        >
                                            <TableCell className="font-medium">
                                                {city.name}
                                            </TableCell>
                                            <TableCell>{regionName}</TableCell>
                                            <TableCell>
                                                {city.createdAt
                                                    ? new Date(
                                                          city.createdAt
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
                                                            setSelectedCity(
                                                                city
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
                                                            setSelectedCity(
                                                                city
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
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Total de {data?.totalItems ?? 0} villes
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
