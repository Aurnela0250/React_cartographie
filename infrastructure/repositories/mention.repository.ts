import { Mention } from "@/core/entities/mention.entity";
import {
    PaginatedPlain,
    PaginatedResult,
    PaginationParams,
} from "@/core/entities/pagination";
import { IMentionRepository } from "@/core/interfaces/mention.repository.interface";
import { env } from "@/env.mjs";
import { toCamelCaseRecursive, toSnakeCaseRecursive } from "@/shared/utils";
import { handleApiResponse } from "@/shared/utils/api-errors";

export class MentionApiRepository implements IMentionRepository {
    async getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<Mention>> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/mentions?page=${param.page}&per_page=${param.perPage || 10}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<PaginatedPlain<unknown>>(response);
        const camelCasedData = toCamelCaseRecursive(data);
        const paginatedRaw = PaginatedResult.fromPlain(camelCasedData);
        const result = PaginatedResult.mapItemsToEntity(paginatedRaw, Mention);

        return result;
    }

    async get(token: string, id: number): Promise<Mention> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/mentions/${id}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<unknown>(response);

        return Mention.fromUnknown(toCamelCaseRecursive(data));
    }

    async create(
        token: string,
        data: { name: string; domainId: number }
    ): Promise<Mention> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/mentions`;
        // Conversion camelCase -> snake_case pour l'API
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

        return Mention.fromUnknown(toCamelCaseRecursive(res));
    }

    async update(
        token: string,
        id: number,
        data: { name?: string; domainId?: number }
    ): Promise<Mention> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/mentions/${id}`;
        // Conversion camelCase -> snake_case pour l'API
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

        return Mention.fromUnknown(toCamelCaseRecursive(res));
    }

    async delete(token: string, id: number): Promise<boolean> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/mentions/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        await handleApiResponse<unknown>(response);

        return true;
    }
}
