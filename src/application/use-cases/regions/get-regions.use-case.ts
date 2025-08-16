import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";
import { Region } from "@/src/entities/models/region.entity";

import { IRegionsRepository } from "../../repositories/region.repository.interface";

export type IGetRegionsUseCase = ReturnType<typeof getRegionsUseCase>;

export const getRegionsUseCase =
    (regionRepository: IRegionsRepository) =>
    async (
        token: string,
        options: {
            params: PaginationParams;
        }
    ): Promise<PaginatedResult<Region>> => {
        // TODO: Check the permission if is valid

        const regions = await regionRepository.getRegions(
            token,
            options.params
        );

        return regions;
    };
