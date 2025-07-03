"use client";

import { Edit, Trash } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { Domain } from "@/core/entities/domain.entity";
import { PaginatedResult } from "@/core/entities/pagination";
import { Button } from "@/presentation/components/ui/button";
import { fetchWithAutoRefresh } from "@/shared/utils/fetch-with-refresh";
import { useQuery } from "@tanstack/react-query";

import { DomainListSkeleton } from "./domain-list-skeleton";
import { useDomainStore } from "./domain-store";

// Ce composant est déjà conforme au pattern : il utilise uniquement le store pour piloter l'état UI (édition, suppression).

export function DomainList() {
    const {
        setSelectedDomain,
        setIsAddEditDialogOpen,
        setIsDeleteDialogOpen,
        setDeleteDomainData,
        setFormError,
    } = useDomainStore();

    // Synchronise page et name avec l'URL
    const [{ page, name }, setQuery] = useQueryStates({
        page: parseAsInteger.withDefault(1),
        name: parseAsString.withDefault(""),
    });
    const perPage = 20;

    const fetchDomains = async (): Promise<PaginatedResult<Domain>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: perPage.toString(),
        });

        if (name) params.set("name", name);
        const res = await fetchWithAutoRefresh(
            `/api/domains?${params.toString()}`
        );
        const json = await res.json();

        return PaginatedResult.fromJson(json, Domain);
    };

    const { data, isLoading } = useQuery<PaginatedResult<Domain>>({
        queryKey: ["domains", page, name],
        queryFn: fetchDomains,
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
    });

    return (
        <div className="max-h-full space-y-2 overflow-auto">
            {/* Champ de recherche par nom */}
            <div className="mb-4 flex w-full max-w-md gap-2">
                <input
                    className="w-full rounded-lg border px-3 py-2"
                    placeholder="Rechercher un domaine par nom..."
                    type="search"
                    value={name}
                    onChange={(e) =>
                        setQuery({ name: e.target.value, page: 1 })
                    }
                />
            </div>
            <table className="w-full rounded-lg border">
                <thead>
                    <tr>
                        <th className="px-3 py-2 text-left">Nom</th>
                        <th className="px-3 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <DomainListSkeleton />
                    ) : (
                        data?.items?.map((domain: Domain) => (
                            <tr
                                key={domain.id}
                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                                <td className="px-3 py-2 font-bold">
                                    {domain.name}
                                </td>
                                <td className="px-3 py-2">
                                    <div className="flex gap-2">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => {
                                                setFormError(null);
                                                setSelectedDomain(domain);
                                                setIsAddEditDialogOpen(true);
                                            }}
                                        >
                                            <Edit className="size-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            onClick={() => {
                                                setFormError(null);
                                                setDeleteDomainData(domain);
                                                setIsDeleteDialogOpen(true);
                                            }}
                                        >
                                            <Trash className="size-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Total de {data?.totalItems ?? 0} domaines
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        disabled={page <= 1}
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
                        disabled={!!data && page >= (data?.totalPages ?? 1)}
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
