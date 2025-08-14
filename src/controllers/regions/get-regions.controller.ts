import { PaginatedResult, PaginationParams } from "@/src/entities/models/pagination";
import { Region } from "@/src/entities/models/region.entity";
import { IGetRegionsUseCase } from "@/src/application/use-cases/regions/get-regions.use-case";

export interface IGetRegionsController {
    (
        token: string,
        options?: { params: PaginationParams }
    ): Promise<PaginatedResult<Region>>;
}

export const getRegionsController = (
    getRegionsUseCase: IGetRegionsUseCase
): IGetRegionsController => {
    return async (
        token: string,
        options?: { params: PaginationParams }
    ): Promise<PaginatedResult<Region>> => {
        return getRegionsUseCase(token, options);
    };
};