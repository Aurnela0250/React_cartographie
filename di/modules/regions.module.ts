import { getRegionsUseCase } from "@/src/application/use-cases/regions/get-regions.use-case";
import { getRegionsController } from "@/src/controllers/regions/get-regions.controller";
import { RegionsRepository } from "@/src/infrastructure/repositories/regions.repository";
import { createModule } from "@evyweb/ioctopus";

import { DI_SYMBOLS } from "../types";

export const createRegionsModule = () => {
    const regionsModule = createModule();

    regionsModule.bind(DI_SYMBOLS.IRegionsRepository).toClass(RegionsRepository);

    regionsModule
        .bind(DI_SYMBOLS.IGetRegionsUseCase)
        .toHigherOrderFunction(getRegionsUseCase, [
            DI_SYMBOLS.IRegionsRepository,
        ]);

    regionsModule
        .bind(DI_SYMBOLS.IGetRegionsController)
        .toHigherOrderFunction(getRegionsController, [
            DI_SYMBOLS.IGetRegionsUseCase,
        ]);

    return regionsModule;
};