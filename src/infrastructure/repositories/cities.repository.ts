import { env } from "@/env.mjs";
import {
    handleApiResponse,
    toCamelCaseRecursive,
    toSnakeCaseRecursive,
} from "@/shared/utils";
import { ICitiesRepository } from "@/src/application/repositories/cities.repository.interface";
import { CityFilter } from "@/src/entities/filters/city.filter";
import { City } from "@/src/entities/models/city.entity";
import {
    PaginatedPlain,
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export class CitiesRepository implements ICitiesRepository {
    async filterCities(
        token: string,
        options?: {
            params?: PaginationParams;
            filters?: CityFilter;
        }
    ): Promise<PaginatedResult<City>> {
        const { params = { page: 1, perPage: 10 }, filters } = options || {
            params: { page: 1, perPage: 10 },
            filters: {},
        };

        // Clean filters to remove null/undefined/empty values
        const cleanedFilters = Object.fromEntries(
            Object.entries(filters || {}).filter(
                ([, value]) =>
                    value !== null && value !== undefined && value !== ""
            )
        );

        // Build filter URL with pagination
        const filterParams = new URLSearchParams({
            page: params.page?.toString() || "1",
            per_page: params.perPage?.toString() || "10",
            ...toSnakeCaseRecursive(cleanedFilters as Record<string, string>),
        });

        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/cities/filter/?${filterParams.toString()}`;

        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            next: {
                tags: ["cities"],
            },
        });

        const data = await handleApiResponse<PaginatedPlain<City>>(response);

        const result = toCamelCaseRecursive(data);

        return result;
    }

    async getCities(
        token: string,
        options?: { params: PaginationParams }
    ): Promise<PaginatedResult<City>> {
        const { params } = options || { params: { page: 1, perPage: 10 } };
        const { page = 1, perPage = 10 } = params;

        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/cities/?page=${page}&per_page=${perPage}`;

        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            next: {
                tags: ["cities"],
            },
        });

        const data = await handleApiResponse<PaginatedPlain<City>>(response);
        const result = toCamelCaseRecursive(data);

        return result;
    }

    async getCity(token: string, id: number): Promise<City> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/cities/${id}`;

        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            next: {
                tags: ["cities"],
            },
        });

        const data = await handleApiResponse<City>(response);
        const result = toCamelCaseRecursive(data);

        return result;
    }

    async createCity(
        token: string,
        data: { name: string; regionId: number }
    ): Promise<City> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/cities`;

        // Convert to snake_case for API compatibility
        const payload = toSnakeCaseRecursive(data);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const res = await handleApiResponse<City>(response);
        const result = toCamelCaseRecursive(res);

        return result;
    }

    async updateCity(
        token: string,
        id: number,
        data: { name?: string; regionId?: number }
    ): Promise<City> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/cities/${id}`;

        // Convert to snake_case for API compatibility
        const payload = toSnakeCaseRecursive(data);

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const res = await handleApiResponse<City>(response);
        const result = toCamelCaseRecursive(res);

        return result;
    }

    async deleteCity(token: string, id: number): Promise<boolean> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/cities/${id}`;

        const response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        await handleApiResponse<unknown>(response);
        return true;
    }
}
