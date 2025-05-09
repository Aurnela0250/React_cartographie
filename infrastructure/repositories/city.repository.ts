import { City } from "@/core/domain/entities/city.entity";
import {
    PaginatedPlain,
    PaginatedResult,
    PaginationParams,
} from "@/core/domain/entities/pagination";
import { ICityRepository } from "@/core/interfaces/city.repository.interface";
import { env } from "@/env.mjs";
import { toCamelCaseRecursive } from "@/shared/utils";
import { handleApiResponse } from "@/shared/utils/api-errors";

export class CityApiRepository implements ICityRepository {
    async getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<City>> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/cities?page=${param.page}&per_page=${param.perPage || 10}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<PaginatedPlain<unknown>>(response);

        const camelCasedData = toCamelCaseRecursive(data);

        const paginatedRaw = PaginatedResult.fromPlain(camelCasedData);

        const result = PaginatedResult.mapItemsToEntity(paginatedRaw, City);

        return result;
    }

    async get(token: string, id: number): Promise<City> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/cities/${id}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<unknown>(response);

        return City.fromUnknown(toCamelCaseRecursive(data));
    }
    async create(
        token: string,
        data: { name: string; region_id: number }
    ): Promise<City> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/cities`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        const res = await handleApiResponse<unknown>(response);

        return City.fromUnknown(toCamelCaseRecursive(res));
    }
    async update(
        token: string,
        id: number,
        data: { name?: string; region_id?: number }
    ): Promise<City> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/cities/${id}`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        const res = await handleApiResponse<unknown>(response);

        return City.fromUnknown(toCamelCaseRecursive(res));
    }
    async delete(token: string, id: number): Promise<boolean> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/cities/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        await handleApiResponse<unknown>(response);

        return true;
    }
}
