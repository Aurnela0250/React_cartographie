import { EstablishmentType } from "@/core/entities/establishment-type.entity";
import {
    PaginatedPlain,
    PaginatedResult,
    PaginationParams,
} from "@/core/entities/pagination";
import { EstablishmentTypeFilter } from "@/core/filters/establishment-type.filter";
import { IEstablishmentTypeRepository } from "@/core/interfaces/establishment-type.repository.interface";
import { env } from "@/env.mjs";
import { toCamelCaseRecursive, toSnakeCaseRecursive } from "@/shared/utils";
import { handleApiResponse } from "@/shared/utils/api-errors";

export class EstablishmentTypeApiRepository
    implements IEstablishmentTypeRepository
{
    async filter(
        token: string,
        filters: EstablishmentTypeFilter
    ): Promise<PaginatedResult<EstablishmentType>> {
        const cleanedFilters = Object.fromEntries(
            Object.entries(filters).filter(
                ([, value]) =>
                    value !== null && value !== undefined && value !== ""
            )
        );

        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishment-types/filter/?${new URLSearchParams(toSnakeCaseRecursive(cleanedFilters as Record<string, string>)).toString()}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await handleApiResponse<PaginatedPlain<unknown>>(response);
        const camelCasedData = toCamelCaseRecursive(data);
        const paginatedRaw = PaginatedResult.fromPlain(camelCasedData);

        return PaginatedResult.mapItemsToEntity(
            paginatedRaw,
            EstablishmentType
        );
    }
    async getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<EstablishmentType>> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishment-types/?page=${param.page}&per_page=${param.perPage || 10}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<PaginatedPlain<unknown>>(response);

        const camelCasedData = toCamelCaseRecursive(data);

        const paginatedRaw = PaginatedResult.fromPlain(camelCasedData);

        return PaginatedResult.mapItemsToEntity(
            paginatedRaw,
            EstablishmentType
        );
    }
    async get(token: string, id: number): Promise<EstablishmentType> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishment-types/${id}/`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<unknown>(response);

        return EstablishmentType.fromUnknown(toCamelCaseRecursive(data));
    }
    async create(
        token: string,
        data: { name: string; description?: string }
    ): Promise<EstablishmentType> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishment-types/`;
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

        return EstablishmentType.fromUnknown(toCamelCaseRecursive(res));
    }
    async update(
        token: string,
        id: number,
        data: { name?: string; description?: string }
    ): Promise<EstablishmentType> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishment-types/${id}/`;
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

        return EstablishmentType.fromUnknown(toCamelCaseRecursive(res));
    }
    async delete(token: string, id: number): Promise<boolean> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishment-types/${id}/`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        await handleApiResponse<unknown>(response);

        return true;
    }
}
