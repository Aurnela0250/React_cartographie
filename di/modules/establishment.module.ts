import { filterEstablishmentsUseCase } from "@/src/application/use-cases/establishments/filter-establishment.use-case";
import { filterEstablishmentsController } from "@/src/controllers/establishments/filter-establishments.controller";
import { EstablishmentRepository } from "@/src/infrastructure/repositories/establishment.repository";
import { createModule } from "@evyweb/ioctopus";

import { DI_SYMBOLS } from "../types";

export const createEstablishmentModule = () => {
    const establishmentModule = createModule();

    establishmentModule
        .bind(DI_SYMBOLS.IEstablishmentRepository)
        .toClass(EstablishmentRepository);

    establishmentModule
        .bind(DI_SYMBOLS.IFilterEstablishmentsUseCase)
        .toHigherOrderFunction(filterEstablishmentsUseCase, [
            DI_SYMBOLS.IEstablishmentRepository,
        ]);

    establishmentModule
        .bind(DI_SYMBOLS.IFilterEstablishmentsController)
        .toHigherOrderFunction(filterEstablishmentsController, [
            DI_SYMBOLS.IFilterEstablishmentsUseCase,
        ]);

    return establishmentModule;
};
