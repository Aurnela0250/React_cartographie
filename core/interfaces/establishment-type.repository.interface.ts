import { EstablishmentType } from "@/core/entities/establishment-type.entity";
import { PaginatedResult, PaginationParams } from "@/core/entities/pagination";

import { EstablishmentTypeFilter } from "../filters/establishment-type.filter";

export interface IEstablishmentTypeRepository {
    getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<EstablishmentType>>;
    get(token: string, id: number): Promise<EstablishmentType>;
    create(
        token: string,
        data: {
            name: string;
            description?: string;
        }
    ): Promise<EstablishmentType>;
    update(
        token: string,
        id: number,
        data: {
            name?: string;
            description?: string;
        }
    ): Promise<EstablishmentType>;
    delete(token: string, id: number): Promise<boolean>;
    filter(
        token: string,
        filters: EstablishmentTypeFilter
    ): Promise<PaginatedResult<EstablishmentType>>;
}
