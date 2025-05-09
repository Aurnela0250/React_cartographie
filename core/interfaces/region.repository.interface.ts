import {
    PaginatedResult,
    PaginationParams,
} from "@/core/domain/entities/pagination";
import { Region } from "@/core/domain/entities/region.entity";

export interface IRegionRepository {
    getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<Region>>;
    get(token: string, id: number): Promise<Region>;
    create(
        token: string,
        data: { name: string; code?: string }
    ): Promise<Region>;
    update(
        token: string,
        id: number,
        data: { name?: string; code?: string }
    ): Promise<Region>;
    delete(token: string, id: number): Promise<boolean>;
}
