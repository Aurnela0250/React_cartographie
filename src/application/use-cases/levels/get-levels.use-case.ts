import { ILevelsRepository } from "@/src/application/repositories/levels.repository.interface";
import { Level } from "@/src/entities/models/level.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export type IGetLevelsUseCase = ReturnType<typeof getLevelsUseCase>;

export const getLevelsUseCase =
    (levelRepository: ILevelsRepository) =>
    async (
        token: string,
        options?: {
            params?: PaginationParams;
        }
    ): Promise<PaginatedResult<Level>> => {
        // TODO: Check the permission if is valid

        const levels = await levelRepository.getLevels(token, options);

        return levels;
    };
