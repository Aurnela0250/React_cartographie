import { EstablishmentTypeFilter } from "@/src/entities/filters/establishment-type.filter";
import { EstablishmentType } from "@/src/entities/models/establishment-type.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export interface IEstablishmentTypeRepository {
    getEstablishmentTypes(
        token: string,
        options?: {
            params?: PaginationParams;
        }
    ): Promise<PaginatedResult<EstablishmentType>>;
    getEstablishmentType(token: string, id: number): Promise<EstablishmentType>;
    createEstablishmentType(
        token: string,
        data: {
            name: string;
            description?: string;
        }
    ): Promise<EstablishmentType>;
    updateEstablishmentType(
        token: string,
        id: number,
        data: {
            name?: string;
            description?: string;
        }
    ): Promise<EstablishmentType>;
    deleteEstablishmentType(token: string, id: number): Promise<boolean>;
    filterEstablishmentTypes(
        token: string,
        options?: {
            params?: PaginationParams;
            filters?: EstablishmentTypeFilter;
        }
    ): Promise<PaginatedResult<EstablishmentType>>;
}
