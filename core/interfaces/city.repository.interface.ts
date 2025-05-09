import { City } from "@/core/domain/entities/city.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/core/domain/entities/pagination";

export interface ICityRepository {
    getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<City>>;
    get(token: string, id: number): Promise<City>;
    create(
        token: string,
        data: { name: string; region_id: number }
    ): Promise<City>;
    update(
        token: string,
        id: number,
        data: { name?: string; region_id?: number }
    ): Promise<City>;
    delete(token: string, id: number): Promise<boolean>;
}
