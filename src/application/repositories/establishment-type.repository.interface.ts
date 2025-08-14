import { EstablishmentTypeFilter } from "@/src/entities/filters/establishment-type.filter";
import { EstablishmentType } from "@/src/entities/models/establishment-type.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

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
