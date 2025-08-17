import { env } from "@/env.mjs";
import {
    handleApiResponse,
    toCamelCaseRecursive,
    toSnakeCaseRecursive,
} from "@/shared/utils";
import { IEstablishmentTypeRepository } from "@/src/application/repositories/establishment-type.repository.interface";
import { EstablishmentTypeFilter } from "@/src/entities/filters/establishment-type.filter";
import { EstablishmentType } from "@/src/entities/models/establishment-type.entity";
import {
    PaginatedPlain,
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export class EstablishmentTypesRepository
    implements IEstablishmentTypeRepository
{
    async getEstablishmentTypes(
        token: string,
        options?: {
            params?: PaginationParams;
        }
    ): Promise<PaginatedResult<EstablishmentType>> {
        const { params } = options || { params: { page: 1, perPage: 10 } };
        const { page, perPage } = params || { page: 1, perPage: 10 };

        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishment-types/?page=${page}&per_page=${perPage}`;

        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            next: {
                tags: ["establishment-types"],
            },
        });
        const data =
            await handleApiResponse<PaginatedPlain<EstablishmentType>>(
                response
            );

        const result = toCamelCaseRecursive(data);

        return result;
    }
    getEstablishmentType(
        token: string,
        id: number
    ): Promise<EstablishmentType> {
        throw new Error("Method not implemented.");
    }
    createEstablishmentType(
        token: string,
        data: { name: string; description?: string }
    ): Promise<EstablishmentType> {
        throw new Error("Method not implemented.");
    }
    updateEstablishmentType(
        token: string,
        id: number,
        data: { name?: string; description?: string }
    ): Promise<EstablishmentType> {
        throw new Error("Method not implemented.");
    }
    deleteEstablishmentType(token: string, id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    filterEstablishmentTypes(
        token: string,
        options?: {
            params?: PaginationParams;
            filters?: EstablishmentTypeFilter;
        }
    ): Promise<PaginatedResult<EstablishmentType>> {
        throw new Error("Method not implemented.");
    }
}
