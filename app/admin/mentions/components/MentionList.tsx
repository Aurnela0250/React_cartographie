import { useCallback, useRef } from "react";
import { Edit, Trash } from "lucide-react";

import { Mention } from "@/core/entities/mention.entity";
import { PaginatedResult } from "@/core/entities/pagination";
import { Button } from "@/presentation/components/ui/button";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function MentionList({
    onEdit,
    onDelete,
}: {
    onEdit: (mention: Mention) => void;
    onDelete: (mention: Mention) => void;
}) {
    const fetchMentions = async ({
        pageParam = 1,
    }): Promise<PaginatedResult<Mention>> => {
        const res = await fetch(`/api/mentions?page=${pageParam}&per_page=5`);

        // On ne consomme le body qu'une seule fois !
        return res.json();
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ["mentions"],
        queryFn: fetchMentions,
        getNextPageParam: (lastPage: PaginatedResult<Mention>) =>
            lastPage.nextPage ? lastPage.nextPage : undefined,
        initialPageParam: 1,
    });

    const observer = useRef<IntersectionObserver | null>(null);
    const lastMentionRef = useCallback(
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

    // Récupérer la liste des domaines pour affichage du nom
    const { data: domains } = useQuery<{ id: number; name: string }[]>({
        queryKey: ["domains", "all"],
        queryFn: async () => {
            const res = await fetch("/api/domains?page=1&per_page=100");
            const json = await res.json();

            return json.items || [];
        },
    });

    return (
        <div className="max-h-full space-y-2 overflow-auto">
            {data?.pages.map((page, i) =>
                page.items.map((mention: Mention, idx: number) => {
                    const isLast =
                        i === data.pages.length - 1 &&
                        idx === page.items.length - 1;

                    // Chercher le nom du domaine correspondant
                    const domainName =
                        domains?.find((d) => d.id === mention.domainId)?.name ||
                        `ID: ${mention.domainId}`;

                    return (
                        <div
                            key={mention.id}
                            ref={isLast ? lastMentionRef : undefined}
                            className="flex items-center justify-between rounded border p-2"
                        >
                            <div>
                                <div className="font-bold">{mention.name}</div>
                                <div className="text-xs text-gray-500">
                                    Domaine : {domainName}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => onEdit(mention)}
                                >
                                    <Edit className="size-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => onDelete(mention)}
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
