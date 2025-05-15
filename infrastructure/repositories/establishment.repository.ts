import { Establishment } from "@/core/entities/establishment.entity";
import {
    PaginatedPlain,
    PaginatedResult,
    PaginationParams,
} from "@/core/entities/pagination";
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
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishments/${id}`;
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
            acronyme?: string;
            address: string;
            contacts?: string[];
            siteUrl?: string;
            description?: string;
            latitude?: number;
            longitude?: number;
            establishmentTypeId: number;
            sectorId: number;
        }
    ): Promise<Establishment> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishments`;
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
    ): Promise<boolean> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishments/${id}/rate`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(toSnakeCaseRecursive(data)),
        });

        await handleApiResponse<unknown>(response);

        return true;
    }
    async update(
        token: string,
        id: number,
        data: {
            name?: string;
            acronyme?: string;
            address?: string;
            contacts?: string[];
            siteUrl?: string;
            description?: string;
            latitude?: number;
            longitude?: number;
            establishmentTypeId?: number;
            sectorId?: number;
        }
    ): Promise<Establishment> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishments/${id}`;

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
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishments/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        await handleApiResponse<unknown>(response);

        return true;
    }
    async filter(
        token: string,
        param: PaginationParams,
        filters: {
            name?: string;
            acronyme?: string;
            establishmentTypeId?: number;
            cityId?: number;
            regionId?: number;
        }
    ): Promise<PaginatedResult<Establishment>> {
        const queryParams = new URLSearchParams();
        const { page = 1, perPage = 10 } = param;

        queryParams.append("page", page.toString());
        queryParams.append("per_page", perPage.toString());

        if (filters.name) queryParams.append("name", filters.name);
        if (filters.acronyme) queryParams.append("acronyme", filters.acronyme);
        if (filters.establishmentTypeId)
            queryParams.append(
                "establishment_type_id",
                filters.establishmentTypeId.toString()
            );
        if (filters.cityId)
            queryParams.append("city_id", filters.cityId.toString());
        if (filters.regionId)
            queryParams.append("region_id", filters.regionId.toString());

        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishments/filter?${queryParams.toString()}`;
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
