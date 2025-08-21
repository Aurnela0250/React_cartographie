import { IFilterFormationsUseCase } from "@/src/application/use-cases/formations/filter-formations.use-case";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { FormationFilter } from "@/src/entities/filters/formation.filter";
import { Formation } from "@/src/entities/models/formation.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export type IFilterFormationsController = ReturnType<
    typeof filterFormationsController
>;

export const filterFormationsController =
    (filterFormationsUseCase: IFilterFormationsUseCase) =>
    async (
        token?: string,
        options?: {
            params?: PaginationParams;
            filters?: FormationFilter;
        }
    ): Promise<PaginatedResult<Formation>> => {
        if (!token) {
            throw new UnauthenticatedError("Must be logged in");
        }
        const formations = await filterFormationsUseCase(token, options);

        return formations;
    };
