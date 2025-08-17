import { IEstablishmentTypeRepository } from "@/src/application/repositories/establishment-type.repository.interface";
import { EstablishmentType } from "@/src/entities/models/establishment-type.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export type IGetEstablishmentTypesUseCase = ReturnType<
    typeof getEstablishmentTypesUseCase
>;

export const getEstablishmentTypesUseCase =
    (establishmentTypeRepository: IEstablishmentTypeRepository) =>
    async (
        token: string,
        options?: { params?: PaginationParams }
    ): Promise<PaginatedResult<EstablishmentType>> => {
        // TODO: Check the permission if is valid

        const establishmentTypes =
            await establishmentTypeRepository.getEstablishmentTypes(
                token,
                options
            );
        return establishmentTypes;
    };
