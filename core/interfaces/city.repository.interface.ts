import { City } from "@/core/entities/city.entity";
import { PaginatedResult, PaginationParams } from "@/core/entities/pagination";

export interface ICityRepository {
    getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<City>>;
    get(token: string, id: number): Promise<City>;
    create(
        token: string,
        data: { name: string; regionId: number }
    ): Promise<City>;
    update(
        token: string,
        id: number,
        data: { name?: string; regionId?: number }
    ): Promise<City>;
    delete(token: string, id: number): Promise<boolean>;
}
