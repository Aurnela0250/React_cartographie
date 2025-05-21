import type { Establishment } from "@/core/entities/establishment.entity";
import type { PaginatedResult } from "@/core/entities/pagination";
import { useInfiniteQuery } from "@tanstack/react-query";

export type FilterParams = {
    name?: string;
    acronyme?: string;
    establishmentTypeId?: number;
    cityId?: number;
    regionId?: number;
};

export type UseFilterEstablishmentsOptions = {
    filters: FilterParams;
    enabled?: boolean;
    perPage?: number;
};

export function useFilterEstablishments({
    filters,
    enabled = true,
    perPage = 12,
}: UseFilterEstablishmentsOptions) {
    return useInfiniteQuery<PaginatedResult<Establishment>, Error>({
        queryKey: ["establishments", filters, perPage],
        queryFn: async ({ pageParam = 1 }) => {
            const page = typeof pageParam === "number" ? pageParam : 1;
            const params = new URLSearchParams();

            params.append("page", page.toString());
            params.append("per_page", perPage.toString());
            if (filters.name) params.append("name", filters.name);
            if (filters.acronyme) params.append("acronyme", filters.acronyme);
            if (filters.establishmentTypeId)
                params.append(
                    "establishment_type_id",
                    filters.establishmentTypeId.toString()
                );
            if (filters.cityId)
                params.append("city_id", filters.cityId.toString());
            if (filters.regionId)
                params.append("region_id", filters.regionId.toString());

            const res = await fetch(
                `/api/establishments/filter?${params.toString()}`
            );

            if (!res.ok) {
                throw new Error(
                    "Erreur lors de la récupération des établissements"
                );
            }

            return res.json();
        },
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
        initialPageParam: 1,
        enabled,
    });
}
