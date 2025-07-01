import { PaginatedResult, PaginationParams } from "@/core/entities/pagination";
import { Region } from "@/core/entities/region.entity";

import { RegionFilter } from "../filters/region.filter";

export interface IRegionRepository {
    getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<Region>>;
    get(token: string, id: number): Promise<Region>;
    create(
        token: string,
        data: {
            name: string;
        }
    ): Promise<Region>;
    update(
        token: string,
        id: number,
        data: {
            name?: string;
        }
    ): Promise<Region>;
    delete(token: string, id: number): Promise<void>;
    filter(
        token: string,
        filters: RegionFilter
    ): Promise<PaginatedResult<Region>>;
}
