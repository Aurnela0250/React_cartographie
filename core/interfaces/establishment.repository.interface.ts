import { Establishment } from "@/core/entities/establishment.entity";
import { PaginatedResult, PaginationParams } from "@/core/entities/pagination";
import { Rate } from "@/core/entities/rate.entity";

import { EstablishmentFilter } from "../filters/establishment.filter";

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
