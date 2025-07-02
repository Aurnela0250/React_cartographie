"use client";

import { useCallback, useRef } from "react";
import { Edit, Trash } from "lucide-react";

import { Domain } from "@/core/entities/domain.entity";
import { PaginatedResult } from "@/core/entities/pagination";
import { Button } from "@/presentation/components/ui/button";
import { fetchWithAutoRefresh } from "@/shared/utils/fetch-with-refresh";
import { useInfiniteQuery } from "@tanstack/react-query";

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

    const fetchDomains = async (): Promise<PaginatedResult<Domain>> => {
        const res = await fetchWithAutoRefresh(`/api/domains`);

        return res.json();
    };

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["domains", "all"],
            queryFn: fetchDomains,
            getNextPageParam: (lastPage: PaginatedResult<Domain>) =>
                lastPage.nextPage ? lastPage.nextPage : undefined,
            initialPageParam: 1,
        });

    const observer = useRef<IntersectionObserver | null>(null);
    const lastDomainRef = useCallback(
        (node: HTMLElement | null) => {
            if (isFetchingNextPage) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(
                (entries: IntersectionObserverEntry[]) => {
                    if (
                        entries[0].isIntersecting &&
                        hasNextPage &&
                        !isFetchingNextPage
                    ) {
                        fetchNextPage();
                    }
                },
                { threshold: 1.0 }
            );
            if (node) observer.current.observe(node);
        },
        [isFetchingNextPage, fetchNextPage, hasNextPage]
    );

    return (
        <div className="max-h-full space-y-2 overflow-auto">
            {data?.pages.map((page, i) =>
                page.items.map((domain: Domain, idx: number) => {
                    const isLast =
                        i === data.pages.length - 1 &&
                        idx === page.items.length - 1;

                    return (
                        <div
                            key={domain.id}
                            ref={isLast ? lastDomainRef : undefined}
                            className="flex items-center justify-between rounded border p-2"
                        >
                            <div>
                                <div className="font-bold">{domain.name}</div>
                            </div>
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
                        </div>
                    );
                })
            )}
            {isFetchingNextPage && <div>Chargement...</div>}
        </div>
    );
}
