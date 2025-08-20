import { IGetEstablishmentUseCase } from "@/src/application/use-cases/establishments/get-establishment.use-case";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { Establishment } from "@/src/entities/models/establishment.entity";

export type IGetEstablishmentController = ReturnType<
    typeof getEstablishmentController
>;

export const getEstablishmentController =
    (getEstablishmentUseCase: IGetEstablishmentUseCase) =>
    async (id: number, token?: string): Promise<Establishment> => {
        if (!token) {
            throw new UnauthenticatedError("Must be logged in");
        }
        const establishment = await getEstablishmentUseCase(token, id);

        return establishment;
    };
