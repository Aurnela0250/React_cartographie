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
    getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<EstablishmentType>> {
        throw new Error("Method not implemented.");
    }
    get(token: string, id: number): Promise<EstablishmentType> {
        throw new Error("Method not implemented.");
    }
    create(
        token: string,
        data: { name: string; description?: string }
    ): Promise<EstablishmentType> {
        throw new Error("Method not implemented.");
    }
    update(
        token: string,
        id: number,
        data: { name?: string; description?: string }
    ): Promise<EstablishmentType> {
        throw new Error("Method not implemented.");
    }
    delete(token: string, id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    filter(
        token: string,
        filters: EstablishmentTypeFilter
    ): Promise<PaginatedResult<EstablishmentType>> {
        throw new Error("Method not implemented.");
    }
}
