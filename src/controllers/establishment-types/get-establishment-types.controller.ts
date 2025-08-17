import { IGetEstablishmentTypesUseCase } from "@/src/application/use-cases/establishment-types/get-establishment-types.use-case";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { PaginationParams } from "@/src/entities/models/pagination";

export type IGetEstablishmentTypesController = ReturnType<
    typeof getEstablishmentTypesController
>;

export const getEstablishmentTypesController =
    (getEstablishmentTypesUseCase: IGetEstablishmentTypesUseCase) =>
    async (
        token: string | undefined,
        options?: { params?: PaginationParams }
    ) => {
        if (!token) {
            throw new UnauthenticatedError("Must be logged in");
        }

        const establishmentTypes = await getEstablishmentTypesUseCase(
            token,
            options
        );

        return establishmentTypes;
    };
