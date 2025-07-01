import { Level } from "@/core/entities/level.entity";
import {
    PaginatedPlain,
    PaginatedResult,
    PaginationParams,
} from "@/core/entities/pagination";
import { LevelFilter } from "@/core/filters/level.filter";
import { ILevelRepository } from "@/core/interfaces/level.repository.interface";
import { env } from "@/env.mjs";
import { toCamelCaseRecursive, toSnakeCaseRecursive } from "@/shared/utils";
import { handleApiResponse } from "@/shared/utils/api-errors";

export class LevelApiRepository implements ILevelRepository {
    filter(_: string, __: LevelFilter): Promise<PaginatedResult<Level>> {
        throw new Error("Method not implemented.");
    }
    async getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<Level>> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/levels/?page=${param.page}&per_page=${param.perPage || 10}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<PaginatedPlain<unknown>>(response);
        const camelCasedData = toCamelCaseRecursive(data);
        const paginatedRaw = PaginatedResult.fromPlain(camelCasedData);
        const result = PaginatedResult.mapItemsToEntity(paginatedRaw, Level);

        return result;
    }
    async get(token: string, id: number): Promise<Level> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/levels/${id}/`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<unknown>(response);

        return Level.fromUnknown(toCamelCaseRecursive(data));
    }
    async create(
        token: string,
        data: { name: string; acronym?: string }
    ): Promise<Level> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/levels/`;
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

        return Level.fromUnknown(toCamelCaseRecursive(res));
    }
    async update(
        token: string,
        id: number,
        data: { name?: string; acronyme?: string }
    ): Promise<Level> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/levels/${id}/`;
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

        return Level.fromUnknown(toCamelCaseRecursive(res));
    }
    async delete(token: string, id: number): Promise<boolean> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/levels/${id}/`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        await handleApiResponse<unknown>(response);

        return true;
    }
}
