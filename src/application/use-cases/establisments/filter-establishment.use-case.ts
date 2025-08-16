import { IEstablishmentRepository } from "@/src/application/repositories/establishment.repository.interface";
import { EstablishmentFilter } from "@/src/entities/filters/establishment.filter";
import { Establishment } from "@/src/entities/models/establishment.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export type IFilterEstablishmentsUseCase = ReturnType<
    typeof filterEstablishmentsUseCase
>;

export const filterEstablishmentsUseCase =
    (establishmentRepository: IEstablishmentRepository) =>
    async (
        token: string,
        options?: {
            filters?: EstablishmentFilter;
            params?: PaginationParams;
        }
    ): Promise<PaginatedResult<Establishment>> => {
        // TODO: Check the permission if is valid

        const establishments =
            await establishmentRepository.filterEstablishments(token, options);
        return establishments;
    };
