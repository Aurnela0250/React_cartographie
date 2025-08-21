import { filterEstablishmentsUseCase } from "@/src/application/use-cases/establishments/filter-establishment.use-case";
import { getEstablishmentUseCase } from "@/src/application/use-cases/establishments/get-establishment.use-case";
import { filterEstablishmentsController } from "@/src/controllers/establishments/filter-establishments.controller";
import { getEstablishmentController } from "@/src/controllers/establishments/get-establishment.controller";
import { EstablishmentRepository } from "@/src/infrastructure/repositories/establishment.repository";
import { createModule } from "@evyweb/ioctopus";

import { DI_SYMBOLS } from "../types";

export const createEstablishmentModule = () => {
    const establishmentModule = createModule();

    //* Repositories
    establishmentModule
        .bind(DI_SYMBOLS.IEstablishmentRepository)
        .toClass(EstablishmentRepository);

    //* Use Cases
    establishmentModule
        .bind(DI_SYMBOLS.IFilterEstablishmentsUseCase)
        .toHigherOrderFunction(filterEstablishmentsUseCase, [
            DI_SYMBOLS.IEstablishmentRepository,
        ]);
    establishmentModule
        .bind(DI_SYMBOLS.IGetEstablishmentUseCase)
        .toHigherOrderFunction(getEstablishmentUseCase, [
            DI_SYMBOLS.IEstablishmentRepository,
        ]);

    //* Controllers
    establishmentModule
        .bind(DI_SYMBOLS.IFilterEstablishmentsController)
        .toHigherOrderFunction(filterEstablishmentsController, [
            DI_SYMBOLS.IFilterEstablishmentsUseCase,
        ]);
    establishmentModule
        .bind(DI_SYMBOLS.IGetEstablishmentController)
        .toHigherOrderFunction(getEstablishmentController, [
            DI_SYMBOLS.IGetEstablishmentUseCase,
        ]);
    return establishmentModule;
};
