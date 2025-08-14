import { getLevelsUseCase } from "@/src/application/use-cases/levels/get-levels.use-case";
import { getLevelsController } from "@/src/controllers/levels/get-levels.controller";
import { LevelsRepository } from "@/src/infrastructure/repositories/levels.repository";
import { createModule } from "@evyweb/ioctopus";

import { DI_SYMBOLS } from "../types";

export const createLevelsModule = () => {
    const levelsModule = createModule();

    levelsModule.bind(DI_SYMBOLS.ILevelsRepository).toClass(LevelsRepository);

    levelsModule
        .bind(DI_SYMBOLS.IGetLevelsUseCase)
        .toHigherOrderFunction(getLevelsUseCase, [
            DI_SYMBOLS.ILevelsRepository,
        ]);

    levelsModule
        .bind(DI_SYMBOLS.IGetLevelsController)
        .toHigherOrderFunction(getLevelsController, [
            DI_SYMBOLS.IGetLevelsUseCase,
        ]);

    return levelsModule;
};
