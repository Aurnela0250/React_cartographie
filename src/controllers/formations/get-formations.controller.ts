import { IGetFormationsUseCase } from "@/src/application/use-cases/formations/get-formations.use-case";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { Formation } from "@/src/entities/models/formation.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export type IGetFormationsController = ReturnType<
    typeof getFormationsController
>;

export const getFormationsController =
    (getFormationsUseCase: IGetFormationsUseCase) =>
    async (
        token: string,
        options?: {
            params?: PaginationParams;
        }
    ): Promise<PaginatedResult<Formation>> => {
        if (!token) {
            throw new UnauthenticatedError("Must be logged in");
        }
        const formations = await getFormationsUseCase(token, options);

        return formations;
    };
