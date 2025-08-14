"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { City } from "@/core/entities/city.entity";
import { PaginatedResult } from "@/core/entities/pagination";
import { Option } from "@/presentation/components/ui/multiselect";

interface UseCitiesReturn {
    cities: City[];
    citiesOptions: Option[];
    totalItems: number;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
}

async function fetchCities(): Promise<PaginatedResult<City>> {
    const response = await fetch("/api/cities?per_page=100", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: PaginatedResult<City> = await response.json();
    return data;
}

function transformCitiesToOptions(cities: City[]): Option[] {
    return cities.map((city) => ({
        value: city.id?.toString() || "",
        label: city.name || "",
    }));
}

export function useCities(): UseCitiesReturn {
    const query: UseQueryResult<PaginatedResult<City>, Error> = useQuery({
        queryKey: ["cities"],
        queryFn: fetchCities,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const citiesOptions: Option[] = query.data?.items
        ? transformCitiesToOptions(query.data.items)
        : [];

    return {
        cities: query.data?.items || [],
        citiesOptions,
        totalItems: query.data?.totalItems || 0,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
