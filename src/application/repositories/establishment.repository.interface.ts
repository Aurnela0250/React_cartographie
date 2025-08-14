import { EstablishmentFilter } from "@/src/entities/filters/establishment.filter";
import { Establishment } from "@/src/entities/models/establishment.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";
import { Rate } from "@/src/entities/models/rate.entity";

export interface IEstablishmentRepository {
    getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<Establishment>>;
    get(token: string, id: number): Promise<Establishment>;
    create(
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
    update(
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
    delete(token: string, id: number): Promise<boolean>;
    filter(
        token: string,
        filters: EstablishmentFilter
    ): Promise<PaginatedResult<Establishment>>;
    rate(token: string, id: number, data: { rating: number }): Promise<Rate>;
}
