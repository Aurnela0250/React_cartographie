import { Establishment } from "@/core/entities/establishment.entity";
import { PaginatedResult, PaginationParams } from "@/core/entities/pagination";

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
            contacts?: string[];
            siteUrl?: string;
            description?: string;
            latitude?: number;
            longitude?: number;
            establishmentTypeId: number;
            sectorId: number;
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
            contacts?: string[];
            siteUrl?: string;
            description?: string;
            latitude?: number;
            longitude?: number;
            establishmentTypeId?: number;
            sectorId?: number;
        }
    ): Promise<Establishment>;
    delete(token: string, id: number): Promise<boolean>;
    filter(
        token: string,
        param: PaginationParams,
        filters: {
            name?: string;
            acronyme?: string;
            establishmentTypeId?: number;
            cityId?: number;
            regionId?: number;
        }
    ): Promise<PaginatedResult<Establishment>>;
}
