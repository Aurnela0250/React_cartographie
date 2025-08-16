import { IFilterEstablishmentsUseCase } from "@/src/application/use-cases/establisments/filter-establishment.use-case";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { EstablishmentFilter } from "@/src/entities/filters/establishment.filter";
import { Establishment } from "@/src/entities/models/establishment.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export type IFilterEstablishmentsController = ReturnType<
    typeof filterEstablishmentsController
>;

export const filterEstablishmentsController =
    (filterEstablishmentsUseCase: IFilterEstablishmentsUseCase) =>
    async (
        token?: string,
        options?: { filters?: EstablishmentFilter; params?: PaginationParams }
    ): Promise<PaginatedResult<Establishment>> => {
        if (!token) {
            throw new UnauthenticatedError("Must be logged in");
        }
        const establishments = await filterEstablishmentsUseCase(
            token,
            options
        );

        return establishments;
    };
