import {
    PaginatedPlain,
    PaginatedResult,
    PaginationParams,
} from "@/core/domain/entities/pagination";
import { Sector } from "@/core/domain/entities/sector.entity";
import { ISectorRepository } from "@/core/interfaces/sector.repository.interface";
import { env } from "@/env.mjs";
import { toCamelCaseRecursive, toSnakeCaseRecursive } from "@/shared/utils";
import { handleApiResponse } from "@/shared/utils/api-errors";

export class SectorApiRepository implements ISectorRepository {
    async getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<Sector>> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/sectors?page=${param.page}&per_page=${param.perPage || 10}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<PaginatedPlain<unknown>>(response);
        const camelCasedData = toCamelCaseRecursive(data);
        const paginatedRaw = PaginatedResult.fromPlain(camelCasedData);
        const result = PaginatedResult.mapItemsToEntity(paginatedRaw, Sector);

        return result;
    }
    async get(token: string, id: number): Promise<Sector> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/sectors/${id}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<unknown>(response);

        return Sector.fromUnknown(toCamelCaseRecursive(data));
    }
    async create(
        token: string,
        data: { name: string; city_id: number }
    ): Promise<Sector> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/sectors`;
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

        return Sector.fromUnknown(toCamelCaseRecursive(res));
    }
    async update(
        token: string,
        id: number,
        data: { name?: string; city_id?: number }
    ): Promise<Sector> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/sectors/${id}`;
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

        return Sector.fromUnknown(toCamelCaseRecursive(res));
    }
    async delete(token: string, id: number): Promise<boolean> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/sectors/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        await handleApiResponse<unknown>(response);

        return true;
    }
}
