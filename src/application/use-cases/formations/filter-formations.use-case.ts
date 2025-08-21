import { IFormationRepository } from "@/src/application/repositories/formation.repository.interface";
import { FormationFilter } from "@/src/entities/filters/formation.filter";
import { Formation } from "@/src/entities/models/formation.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export type IFilterFormationsUseCase = ReturnType<
    typeof filterFormationsUseCase
>;

export const filterFormationsUseCase =
    (formationRepository: IFormationRepository) =>
    async (
        token: string,
        options?: {
            params?: PaginationParams;
            filters?: FormationFilter;
        }
    ): Promise<PaginatedResult<Formation>> => {
        // TODO: Check the permission if is valid

        const formations = await formationRepository.filterFormations(
            token,
            options
        );

        return formations;
    };
