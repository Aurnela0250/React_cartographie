import { IFormationRepository } from "@/src/application/repositories/formation.repository.interface";
import { Formation } from "@/src/entities/models/formation.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export type IGetFormationsUseCase = ReturnType<typeof getFormationsUseCase>;

export const getFormationsUseCase =
    (formationRepository: IFormationRepository) =>
    async (
        token: string,
        options?: {
            params?: PaginationParams;
        }
    ): Promise<PaginatedResult<Formation>> => {
        // TODO: Check the permission if is valid

        const formations = await formationRepository.getFormations(
            token,
            options
        );

        return formations;
    };
