import { Establishment } from "@/core/entities/establishment.entity";
import {
    PaginatedPlain,
    PaginatedResult,
    PaginationParams,
} from "@/core/entities/pagination";
import { Rate } from "@/core/entities/rate.entity";
import { EstablishmentFilter } from "@/core/filters/establishment.filter";
import { IEstablishmentRepository } from "@/core/interfaces/establishment.repository.interface";
import { env } from "@/env.mjs";
import { toCamelCaseRecursive, toSnakeCaseRecursive } from "@/shared/utils";
import { handleApiResponse } from "@/shared/utils/api-errors";

export class EstablishmentApiRepository implements IEstablishmentRepository {
    async getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<Establishment>> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishments?page=${param.page}&per_page=${param.perPage || 10}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<PaginatedPlain<unknown>>(response);

        const camelCasedData = toCamelCaseRecursive(data);
        const paginatedRaw = PaginatedResult.fromPlain(camelCasedData);
        const result = PaginatedResult.mapItemsToEntity(
            paginatedRaw,
            Establishment
        );

        return result;
    }
    async get(token: string, id: number): Promise<Establishment> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishments/${id}/`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<unknown>(response);

        return Establishment.fromUnknown(toCamelCaseRecursive(data));
    }
    async create(
        token: string,
        data: {
            name: string;
            acronym?: string;
            address?: string;
            contacts?: string[];
            website?: string;
            description?: string;
            latitude?: number;
            longitude?: number;
            establishmentTypeId: number;
            cityId: number;
        }
    ): Promise<Establishment> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishments/`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(toSnakeCaseRecursive(data)),
        });
        const res = await handleApiResponse<unknown>(response);

        return Establishment.fromUnknown(toCamelCaseRecursive(res));
    }
    async rate(
        token: string,
        id: number,
        data: { rating: number }
    ): Promise<Rate> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishments/${id}/rate`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(toSnakeCaseRecursive(data)),
        });

        const responseData = await handleApiResponse<unknown>(response);

        const rate = Rate.fromUnknown(toCamelCaseRecursive(responseData));

        return rate;
    }
    async update(
        token: string,
        id: number,
        data: {
            name: string;
            acronym?: string;
            address?: string;
            contacts?: string[];
            website?: string;
            description?: string;
            latitude?: number;
            longitude?: number;
            establishmentTypeId: number;
            cityId: number;
        }
    ): Promise<Establishment> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishments/${id}/`;

        console.log("data", data);
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(toSnakeCaseRecursive(data)),
        });
        const res = await handleApiResponse<unknown>(response);

        return Establishment.fromUnknown(toCamelCaseRecursive(res));
    }
    async delete(token: string, id: number): Promise<boolean> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishments/${id}/`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        await handleApiResponse<unknown>(response);

        return true;
    }
    async filter(
        token: string,
        filters: EstablishmentFilter
    ): Promise<PaginatedResult<Establishment>> {
        const cleanedFilters = Object.fromEntries(
            Object.entries(filters).filter(
                ([, value]) =>
                    value !== null && value !== undefined && value !== ""
            )
        );

        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishments/filter/?${new URLSearchParams(toSnakeCaseRecursive(cleanedFilters as Record<string, string>)).toString()}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<PaginatedPlain<unknown>>(response);

        const camelCasedData = toCamelCaseRecursive(data);
        const paginatedRaw = PaginatedResult.fromPlain(camelCasedData);
        const result = PaginatedResult.mapItemsToEntity(
            paginatedRaw,
            Establishment
        );

        return result;
    }
}
