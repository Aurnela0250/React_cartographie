import {
    PaginatedResult,
    PaginationParams,
} from "@/core/domain/entities/pagination";
import { Sector } from "@/core/domain/entities/sector.entity";

export interface ISectorRepository {
    getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<Sector>>;
    get(token: string, id: number): Promise<Sector>;
    create(
        token: string,
        data: { name: string; city_id: number }
    ): Promise<Sector>;
    update(
        token: string,
        id: number,
        data: { name?: string; city_id?: number }
    ): Promise<Sector>;
    delete(token: string, id: number): Promise<boolean>;
}
