import { EstablishmentRepository } from "@/src/infrastructure/repositories/establishment.repository";
import { createModule } from "@evyweb/ioctopus";

import { DI_SYMBOLS } from "../types";
import { filterEstablishmentsUseCase } from "@/src/application/use-cases/establisments/filter-establishment.use-case";
import { filterEstablishmentsController } from "@/src/controllers/establishments/filter-establishments.controller";

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
