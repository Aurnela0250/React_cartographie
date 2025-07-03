"use client";

import { Edit, Search, Trash } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import type { Level } from "@/core/entities/level.entity";
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

import { LevelListSkeleton } from "./level-list-skeleton";
import { useLevelStore } from "./level-store";

export function LevelList() {
    const setSelectedLevel = useLevelStore((s) => s.setSelectedLevel);
    const setIsAddEditDialogOpen = useLevelStore(
        (s) => s.setIsAddEditDialogOpen
    );
    const setIsDeleteDialogOpen = useLevelStore((s) => s.setIsDeleteDialogOpen);

    const [{ page, name }, setQuery] = useQueryStates({
        page: parseAsInteger.withDefault(1),
        name: parseAsString.withDefault(""),
    });
    const debouncedName = useDebounce(name, 500);

    // Utiliser l'endpoint filter pour les niveaux si dispo, sinon fallback sur /api/levels
    const fetchFilteredLevels = async (): Promise<PaginatedResult<Level>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: "10",
        });

        if (debouncedName) {
            params.set("name", debouncedName);
        }
        const res = await fetchWithAutoRefresh(
            `/api/levels?${params.toString()}`
        );

        if (!res.ok) {
            throw new Error("Failed to fetch levels");
        }

        return res.json();
    };

    const { data, isLoading } = useQuery<PaginatedResult<Level>>({
        queryKey: ["levels", page, debouncedName],
        queryFn: fetchFilteredLevels,
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
                        placeholder="Rechercher un niveau par nom..."
                        type="search"
                        value={name}
                        onChange={(e) =>
                            setQuery({ name: e.target.value, page: 1 })
                        }
                    />
                </div>
            </div>
            <div className="rounded-md border p-2">
                <div className="relative max-h-[60vh] overflow-auto">
                    <Table>
                        <TableHeader className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Nom</TableHead>
                                <TableHead>Acronyme</TableHead>
                                <TableHead>Date de création</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <LevelListSkeleton />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.items.map((level: Level) => (
                                    <TableRow
                                        key={level.id}
                                        className="transition-colors hover:bg-muted/50"
                                    >
                                        <TableCell className="font-medium">
                                            {level.name}
                                        </TableCell>
                                        <TableCell>
                                            {level.acronym || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {level.createdAt
                                                ? new Date(
                                                      level.createdAt
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
                                                        setSelectedLevel(level);
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
                                                        setSelectedLevel(level);
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
                    Total de {data?.totalItems ?? 0} niveaux
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
