import { EstablishmentFilter } from "@/src/entities/filters/establishment.filter";
import { Establishment } from "@/src/entities/models/establishment.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";
import { Rate } from "@/src/entities/models/rate.entity";

export interface IEstablishmentRepository {
    getEstablishments(
        token: string,
        options?: {
            params: PaginationParams;
        }
    ): Promise<PaginatedResult<Establishment>>;
    getEstablishment(token: string, id: number): Promise<Establishment>;
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
    ): Promise<Establishment>;
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
    ): Promise<Establishment>;
    deleteEstablishment(token: string, id: number): Promise<boolean>;
    filterEstablishments(
        token: string,
        options?: {
            params?: PaginationParams;
            filters?: EstablishmentFilter;
        }
    ): Promise<PaginatedResult<Establishment>>;
    rateEstablishment(
        token: string,
        id: number,
        data: { rating: number }
    ): Promise<Rate>;
}
