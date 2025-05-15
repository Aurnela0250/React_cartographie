import {
    PaginatedPlain,
    PaginatedResult,
    PaginationParams,
} from "@/core/entities/pagination";
import { Region } from "@/core/entities/region.entity";
import { IRegionRepository } from "@/core/interfaces/region.repository.interface";
import { env } from "@/env.mjs";
import { toCamelCaseRecursive, toSnakeCaseRecursive } from "@/shared/utils";
import { handleApiResponse } from "@/shared/utils/api-errors";

export class RegionApiRepository implements IRegionRepository {
    async getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<Region>> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/regions?page=${param.page}&per_page=${param.perPage || 10}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<PaginatedPlain<unknown>>(response);

        const camelCasedData = toCamelCaseRecursive(data);
        const paginatedRaw = PaginatedResult.fromPlain(camelCasedData);
        const result = PaginatedResult.mapItemsToEntity(paginatedRaw, Region);

        return result;
    }
    async get(token: string, id: number): Promise<Region> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/regions/${id}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<unknown>(response);

        return Region.fromUnknown(toCamelCaseRecursive(data));
    }
    async create(
        token: string,
        data: { name: string; code?: string }
    ): Promise<Region> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/regions`;
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

        return Region.fromUnknown(toCamelCaseRecursive(res));
    }
    async update(
        token: string,
        id: number,
        data: { name?: string; code?: string }
    ): Promise<Region> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/regions/${id}`;
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

        return Region.fromUnknown(toCamelCaseRecursive(res));
    }
    async delete(token: string, id: number): Promise<boolean> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/regions/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        await handleApiResponse<unknown>(response);

        return true;
    }
}
