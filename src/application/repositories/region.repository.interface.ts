import { PaginatedResult, PaginationParams } from "@/src/entities/models/pagination";
import { RegionFilter } from "@/src/entities/filters/region.filter";
import { Region } from "@/src/entities/models/region.entity";

export interface IRegionsRepository {
    getRegions(
        token: string,
        options?: { params: PaginationParams }
    ): Promise<PaginatedResult<Region>>;
    getRegion(token: string, id: number): Promise<Region>;
    createRegion(
        token: string,
        data: { name: string }
    ): Promise<Region>;
    updateRegion(
        token: string,
        id: number,
        data: { name?: string }
    ): Promise<Region>;
    deleteRegion(token: string, id: number): Promise<boolean>;
    filterRegions(
        token: string,
        options?: { params: PaginationParams; filters: RegionFilter }
    ): Promise<PaginatedResult<Region>>;
}
