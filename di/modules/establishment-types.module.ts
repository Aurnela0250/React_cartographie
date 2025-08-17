import { getEstablishmentTypesUseCase } from "@/src/application/use-cases/establishment-types/get-establishment-types.use-case";
import { getEstablishmentTypesController } from "@/src/controllers/establishment-types/get-establishment-types.controller";
import { EstablishmentTypesRepository } from "@/src/infrastructure/repositories/establishment-types.repository";
import { createModule } from "@evyweb/ioctopus";

import { DI_SYMBOLS } from "../types";

export const createEstablishmentTypeModule = () => {
    const establishmentTypeModule = createModule();

    establishmentTypeModule
        .bind(DI_SYMBOLS.IEstablishmentTypeRepository)
        .toClass(EstablishmentTypesRepository);

    establishmentTypeModule
        .bind(DI_SYMBOLS.IGetEstablishmentTypesUseCase)
        .toHigherOrderFunction(getEstablishmentTypesUseCase, [
            DI_SYMBOLS.IEstablishmentTypeRepository,
        ]);

    establishmentTypeModule
        .bind(DI_SYMBOLS.IGetEstablishmentTypesController)
        .toHigherOrderFunction(getEstablishmentTypesController, [
            DI_SYMBOLS.IGetEstablishmentTypesUseCase,
        ]);

    return establishmentTypeModule;
};
