import { IGetLevelsUseCase } from "@/src/application/use-cases/levels/get-levels.use-case";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { Level } from "@/src/entities/models/level.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export type IGetLevelsController = ReturnType<typeof getLevelsController>;

export const getLevelsController =
    (getLevelsUseCase: IGetLevelsUseCase) =>
    async (
        token: string | undefined,
        options?: {
            params?: PaginationParams;
        }
    ): Promise<PaginatedResult<Level>> => {
        if (!token) {
            throw new UnauthenticatedError("Must be logged in");
        }

        const domains = await getLevelsUseCase(token, options);

        return domains;
    };
