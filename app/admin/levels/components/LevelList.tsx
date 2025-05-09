import { useCallback, useRef } from "react";
import { Edit, Trash } from "lucide-react";

import { Level } from "@/core/domain/entities/level.entity";
import { PaginatedResult } from "@/core/domain/entities/pagination";
import { Button } from "@/presentation/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";

export function LevelList({
    onEdit,
    onDelete,
}: {
    onEdit: (level: Level) => void;
    onDelete: (level: Level) => void;
}) {
    // Ajout du paramètre per_page=10 pour la pagination
    const fetchLevels = async ({
        pageParam = 1,
    }): Promise<PaginatedResult<Level>> => {
        const res = await fetch(`/api/levels?page=${pageParam}&per_page=5`);

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
        queryKey: ["levels"],
        queryFn: fetchLevels,
        getNextPageParam: (lastPage: PaginatedResult<Level>) =>
            lastPage.nextPage ? lastPage.nextPage : undefined,
        initialPageParam: 1,
    });

    const lastLevelRef = useRef<HTMLDivElement | null>(null);
    const observer = useCallback(
        (node: HTMLDivElement) => {
            if (isFetchingNextPage) return;
            if (lastLevelRef.current) lastLevelRef.current = null;
            if (node) lastLevelRef.current = node;
        },
        [isFetchingNextPage]
    );

    return (
        <div className="max-h-full space-y-2 overflow-auto">
            {data?.pages.map((page, i) =>
                page.items.map((level: Level, idx: number) => {
                    const isLast =
                        i === data.pages.length - 1 &&
                        idx === page.items.length - 1;

                    return (
                        <div
                            key={level.id}
                            ref={isLast ? observer : undefined}
                            className="flex items-center justify-between rounded border p-2"
                        >
                            <div>
                                <div className="font-bold">{level.name}</div>
                                <div className="text-xs text-gray-500">
                                    {level.acronyme}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => onEdit(level)}
                                >
                                    <Edit className="size-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => onDelete(level)}
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
