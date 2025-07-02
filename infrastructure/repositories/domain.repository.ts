import { Domain } from "@/core/entities/domain.entity";
import {
    PaginatedPlain,
    PaginatedResult,
    PaginationParams,
} from "@/core/entities/pagination";
import { DomainFilter } from "@/core/filters/domain.filter";
import { IDomainRepository } from "@/core/interfaces/domain.repository.interface";
import { env } from "@/env.mjs";
import { toCamelCaseRecursive, toSnakeCaseRecursive } from "@/shared/utils";
import { handleApiResponse } from "@/shared/utils/api-errors";

export class DomainApiRepository implements IDomainRepository {
    async filter(
        token: string,
        filters: DomainFilter
    ): Promise<PaginatedResult<Domain>> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/domains/filter`;
        const response = await fetch(url, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(filters),
        });
        const data = await handleApiResponse<PaginatedPlain<Domain>>(response);

        const camelCasedData = toCamelCaseRecursive(data);
        const paginatedRaw = PaginatedResult.fromPlain(camelCasedData);

        return PaginatedResult.mapItemsToEntity(paginatedRaw, Domain);
    }
    async getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<Domain>> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/domains/?page=${param.page}&per_page=${param.perPage || 10}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<PaginatedPlain<unknown>>(response);

        const camelCasedData = toCamelCaseRecursive(data);

        const paginatedRaw = PaginatedResult.fromPlain(camelCasedData);

        return PaginatedResult.mapItemsToEntity(paginatedRaw, Domain);
    }
    async get(token: string, id: number): Promise<Domain> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/domains/${id}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<unknown>(response);

        return Domain.fromUnknown(toCamelCaseRecursive(data));
    }
    async create(
        token: string,
        data: { name: string; description?: string }
    ): Promise<Domain> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/domains`;
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

        return Domain.fromUnknown(toCamelCaseRecursive(res));
    }
    async update(
        token: string,
        id: number,
        data: { name?: string; description?: string }
    ): Promise<Domain> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/domains/${id}`;
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

        return Domain.fromUnknown(toCamelCaseRecursive(res));
    }
    async delete(token: string, id: number): Promise<boolean> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/domains/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        await handleApiResponse<unknown>(response);

        return true;
    }
}
