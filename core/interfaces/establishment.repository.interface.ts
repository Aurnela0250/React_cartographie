import { Establishment } from "@/core/domain/entities/establishment.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/core/domain/entities/pagination";

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
            acronyme?: string;
            address: string;
            contact?: string;
            site_url?: string;
            description?: string;
            latitude?: number;
            longitude?: number;
            establishment_type_id: number;
            sector_id: number;
        }
    ): Promise<Establishment>;
    rate(token: string, id: number, data: { rating: number }): Promise<boolean>;
    update(
        token: string,
        id: number,
        data: {
            name?: string;
            acronyme?: string;
            address?: string;
            contact?: string;
            site_url?: string;
            description?: string;
            latitude?: number;
            longitude?: number;
            establishment_type_id?: number;
            sector_id?: number;
        }
    ): Promise<Establishment>;
    delete(token: string, id: number): Promise<boolean>;
    filter(
        token: string,
        param: PaginationParams,
        filters: {
            name?: string;
            acronyme?: string;
            establishment_type_id?: number;
            city_id?: number;
            region_id?: number;
        }
    ): Promise<PaginatedResult<Establishment>>;
}
