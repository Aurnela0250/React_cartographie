import { env } from "@/env.mjs";
import { handleApiResponse, toCamelCaseRecursive, toSnakeCaseRecursive } from "@/shared/utils";
import { IRegionsRepository } from "@/src/application/repositories/region.repository.interface";
import { RegionFilter } from "@/src/entities/filters/region.filter";
import { Region, RegionEntity } from "@/src/entities/models/region.entity";
import {
    PaginatedPlain,
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export class RegionsRepository implements IRegionsRepository {
    async filterRegions(
        token: string,
        options?: { params: PaginationParams; filters: RegionFilter }
    ): Promise<PaginatedResult<Region>> {
        const { params = { page: 1, perPage: 10 }, filters } = options || {};
        
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
            ...toSnakeCaseRecursive(cleanedFilters as Record<string, string>)
        });

        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/regions/filter/?${filterParams.toString()}`;

        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            next: {
                tags: ["regions"],
            },
        });

        const data = await handleApiResponse<PaginatedPlain<Region>>(response);
        const camelCasedData = toCamelCaseRecursive(data);
        const paginatedRaw = PaginatedResult.fromPlain(camelCasedData);
        
        return PaginatedResult.mapItemsToEntity(paginatedRaw, RegionEntity);
    }

    async getRegions(
        token: string,
        options?: { params: PaginationParams }
    ): Promise<PaginatedResult<Region>> {
        const { params } = options || { params: { page: 1, perPage: 10 } };
        const { page = 1, perPage = 10 } = params;

        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/regions/?page=${page}&per_page=${perPage}`;

        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            next: {
                tags: ["regions"],
            },
        });

        const data = await handleApiResponse<PaginatedPlain<Region>>(response);
        const camelCasedData = toCamelCaseRecursive(data);
        const paginatedRaw = PaginatedResult.fromPlain(camelCasedData);
        
        return PaginatedResult.mapItemsToEntity(paginatedRaw, RegionEntity);
    }

    async getRegion(token: string, id: number): Promise<Region> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/regions/${id}`;

        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            next: {
                tags: ["regions"],
            },
        });

        const data = await handleApiResponse<unknown>(response);
        const camelCasedData = toCamelCaseRecursive(data);
        
        return RegionEntity.fromUnknown(camelCasedData);
    }

    async createRegion(
        token: string,
        data: { name: string }
    ): Promise<Region> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/regions`;
        
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

        const res = await handleApiResponse<unknown>(response);
        const camelCasedData = toCamelCaseRecursive(res);
        
        return RegionEntity.fromUnknown(camelCasedData);
    }

    async updateRegion(
        token: string,
        id: number,
        data: { name?: string }
    ): Promise<Region> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/regions/${id}`;
        
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

        const res = await handleApiResponse<unknown>(response);
        const camelCasedData = toCamelCaseRecursive(res);
        
        return RegionEntity.fromUnknown(camelCasedData);
    }

    async deleteRegion(token: string, id: number): Promise<boolean> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/regions/${id}`;

        const response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        await handleApiResponse<unknown>(response);
        return true;
    }
}