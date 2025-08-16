import { env } from "@/env.mjs";
import { handleApiResponse, toCamelCaseRecursive } from "@/shared/utils";
import { IEstablishmentRepository } from "@/src/application/repositories/establishment.repository.interface";
import { EstablishmentFilter } from "@/src/entities/filters/establishment.filter";
import { Establishment } from "@/src/entities/models/establishment.entity";
import {
    PaginatedPlain,
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";
import { Rate } from "@/src/entities/models/rate.entity";

export class EstablishmentRepository implements IEstablishmentRepository {
    getEstablishments(
        token: string,
        options?: { params: PaginationParams }
    ): Promise<PaginatedResult<Establishment>> {
        throw new Error("Method not implemented.");
    }
    getEstablishment(token: string, id: number): Promise<Establishment> {
        throw new Error("Method not implemented.");
    }
    createEstablishment(
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
        throw new Error("Method not implemented.");
    }
    updateEstablishment(
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
        throw new Error("Method not implemented.");
    }
    deleteEstablishment(token: string, id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async filterEstablishments(
        token: string,
        options?: {
            params?: PaginationParams;
            filters?: EstablishmentFilter;
        }
    ): Promise<PaginatedResult<Establishment>> {
        const { params } = options || { params: { page: 1, perPage: 10 } };
        const { page, perPage } = params || { page: 1, perPage: 10 };

        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishments/filter/?page=${page}&per_page=${perPage}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            next: {
                tags: ["establishments"],
            },
        });
        const data =
            await handleApiResponse<PaginatedPlain<Establishment>>(response);

        const result = toCamelCaseRecursive(data);

        return result;
    }
    rateEstablishment(
        token: string,
        id: number,
        data: { rating: number }
    ): Promise<Rate> {
        throw new Error("Method not implemented.");
    }
}
