import { filterFormationsUseCase } from "@/src/application/use-cases/formations/filter-formations.use-case";
import { getFormationsUseCase } from "@/src/application/use-cases/formations/get-formations.use-case";
import { filterFormationsController } from "@/src/controllers/formations/filter-formations.controller";
import { getFormationsController } from "@/src/controllers/formations/get-formations.controller";
import { FormationsRepository } from "@/src/infrastructure/repositories/formations.repository";
import { createModule } from "@evyweb/ioctopus";

import { DI_SYMBOLS } from "../types";

export const createFormationsModule = () => {
    const formationsModule = createModule();

    //* Repositories
    formationsModule
        .bind(DI_SYMBOLS.IFormationsRepository)
        .toClass(FormationsRepository);

    //* Use Cases
    formationsModule
        .bind(DI_SYMBOLS.IGetFormationsUseCase)
        .toHigherOrderFunction(getFormationsUseCase, [
            DI_SYMBOLS.IFormationsRepository,
        ]);
    formationsModule
        .bind(DI_SYMBOLS.IFilterFormationsUseCase)
        .toHigherOrderFunction(filterFormationsUseCase, [
            DI_SYMBOLS.IFormationsRepository,
        ]);

    //* Controllers
    formationsModule
        .bind(DI_SYMBOLS.IGetFormationsController)
        .toHigherOrderFunction(getFormationsController, [
            DI_SYMBOLS.IGetFormationsUseCase,
        ]);
    formationsModule
        .bind(DI_SYMBOLS.IFilterFormationsController)
        .toHigherOrderFunction(filterFormationsController, [
            DI_SYMBOLS.IFilterFormationsUseCase,
        ]);

    return formationsModule;
};
