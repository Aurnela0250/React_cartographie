"use client";

import { Edit, Search, Trash } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { Domain } from "@/core/entities/domain.entity";
import { Mention } from "@/core/entities/mention.entity";
import { PaginatedResult } from "@/core/entities/pagination";
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

import { MentionListSkeleton } from "./mention-list-skeleton";
import { useMentionStore } from "./mention-store";

export function MentionList() {
    const setSelectedMention = useMentionStore((s) => s.setSelectedMention);
    const setIsAddEditDialogOpen = useMentionStore(
        (s) => s.setIsAddEditDialogOpen
    );
    const setIsDeleteDialogOpen = useMentionStore(
        (s) => s.setIsDeleteDialogOpen
    );

    const [{ page, name, domainId: domainIdStr }, setQuery] = useQueryStates({
        page: parseAsInteger.withDefault(1),
        name: parseAsString.withDefault(""),
        domainId: parseAsString.withDefault("all"),
    });
    const debouncedName = useDebounce(name, 500);

    // Récupérer la liste des domaines (cache 24h)
    const { data: domains, isLoading: isLoadingDomains } = useQuery<Domain[]>({
        queryKey: ["domains", "all"],
        queryFn: async () => {
            const res = await fetchWithAutoRefresh(
                "/api/domains?page=1&per_page=100"
            );
            const json = await res.json();
            const paginated = PaginatedResult.fromJson(json, Domain);

            return paginated.items;
        },
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
    });

    // Utiliser l'endpoint filter pour les mentions
    const fetchFilteredMentions = async (): Promise<
        PaginatedResult<Mention>
    > => {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: "10",
        });

        if (debouncedName) {
            params.set("name", debouncedName);
        }
        if (domainIdStr !== "all") {
            params.set("domainId", domainIdStr);
        }
        const res = await fetchWithAutoRefresh(
            `/api/mentions/filter?${params.toString()}`
        );

        if (!res.ok) {
            throw new Error("Failed to fetch mentions");
        }

        const json = await res.json();
        const paginated = PaginatedResult.fromJson(json, Mention);

        return paginated;
    };

    const { data, isLoading } = useQuery<PaginatedResult<Mention>>({
        queryKey: ["mentions", page, debouncedName, domainIdStr],
        queryFn: fetchFilteredMentions,
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
                        placeholder="Rechercher une mention par nom..."
                        type="search"
                        value={name}
                        onChange={(e) =>
                            setQuery({ name: e.target.value, page: 1 })
                        }
                    />
                </div>
                <div className="w-full md:w-1/3">
                    <Select
                        disabled={isLoadingDomains}
                        value={domainIdStr}
                        onValueChange={(value) =>
                            setQuery({ domainId: value, page: 1 })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filtrer par domaine" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Tous les domaines
                            </SelectItem>
                            {domains?.map((domain) => (
                                <SelectItem
                                    key={domain.id}
                                    value={domain.id!.toString()}
                                >
                                    {domain.name}
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
                                <TableHead>Domaine</TableHead>
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
                                        <MentionListSkeleton />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.items.map((mention: Mention) => {
                                    const domainName =
                                        domains?.find(
                                            (d) => d.id === mention.domainId
                                        )?.name || `ID: ${mention.domainId}`;

                                    return (
                                        <TableRow
                                            key={mention.id}
                                            className="transition-colors hover:bg-muted/50"
                                        >
                                            <TableCell className="font-medium">
                                                {mention.name}
                                            </TableCell>
                                            <TableCell>{domainName}</TableCell>
                                            <TableCell>
                                                {mention.createdAt
                                                    ? new Date(
                                                          mention.createdAt
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
                                                            setSelectedMention(
                                                                mention
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
                                                            setSelectedMention(
                                                                mention
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
                    Total de {data?.totalItems ?? 0} mentions
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
