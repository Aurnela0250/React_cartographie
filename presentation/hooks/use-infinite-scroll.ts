"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseInfiniteScrollOptions<T> {
    fetchItemsAction: (page: number) => Promise<{
        items: T[];
        hasMore: boolean;
    }>;
    initialPage?: number;
    debounceTime?: number;
}

interface UseInfiniteScrollResult<T> {
    items: T[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    resetItems: () => void;
    retryFetch: () => void;
    loadMoreItems: () => void; // Nouvelle fonction pour charger plus d'éléments
}

export function useInfiniteScroll<T>({
    fetchItemsAction,
    initialPage = 1,
    debounceTime = 300,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
    const [items, setItems] = useState<T[]>([]);
    const [page, setPage] = useState(initialPage);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const loadItems = useCallback(
        async (pageToLoad: number, reset = false) => {
            try {
                if (reset) {
                    setLoading(true);
                } else {
                    setLoadingMore(true);
                }
                setError(null);

                const result = await fetchItemsAction(pageToLoad);

                setItems((prev) =>
                    reset ? result.items : [...prev, ...result.items]
                );
                setHasMore(result.hasMore);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Une erreur est survenue lors du chargement des données"
                );
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [fetchItemsAction]
    );

    const debouncedLoadItems = useCallback(
        (pageToLoad: number, reset = false) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                loadItems(pageToLoad, reset);
            }, debounceTime);
        },
        [loadItems, debounceTime]
    );

    const resetItems = useCallback(() => {
        setItems([]);
        setPage(initialPage);
        setHasMore(true);
        setError(null);
        debouncedLoadItems(initialPage, true);
    }, [initialPage, debouncedLoadItems]);

    const retryFetch = useCallback(() => {
        setError(null);
        debouncedLoadItems(page, false);
    }, [debouncedLoadItems, page]);

    const loadMoreItems = useCallback(() => {
        if (hasMore && !loading && !loadingMore && !error) {
            setPage((prevPage) => {
                const nextPage = prevPage + 1;

                debouncedLoadItems(nextPage, false);

                return nextPage;
            });
        }
    }, [hasMore, loading, loadingMore, error, debouncedLoadItems]);

    // Initial load
    useEffect(() => {
        debouncedLoadItems(initialPage, true);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [initialPage, debouncedLoadItems]);

    return {
        items,
        loading,
        loadingMore,
        error,
        hasMore,
        resetItems,
        retryFetch,
        loadMoreItems,
    };
}
