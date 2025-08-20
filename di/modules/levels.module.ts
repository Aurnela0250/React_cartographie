import { getLevelUseCase } from "@/src/application/use-cases/levels/get-level.use-case";
import { getLevelsUseCase } from "@/src/application/use-cases/levels/get-levels.use-case";
import { getLevelController } from "@/src/controllers/levels/get-level.controller";
import { getLevelsController } from "@/src/controllers/levels/get-levels.controller";
import { LevelsRepository } from "@/src/infrastructure/repositories/levels.repository";
import { createModule } from "@evyweb/ioctopus";

import { DI_SYMBOLS } from "../types";

export const createLevelsModule = () => {
    const levelsModule = createModule();

    //* Repositories
    levelsModule.bind(DI_SYMBOLS.ILevelsRepository).toClass(LevelsRepository);

    //* Use Cases
    levelsModule
        .bind(DI_SYMBOLS.IGetLevelsUseCase)
        .toHigherOrderFunction(getLevelsUseCase, [
            DI_SYMBOLS.ILevelsRepository,
        ]);
    levelsModule
        .bind(DI_SYMBOLS.IGetLevelUseCase)
        .toHigherOrderFunction(getLevelUseCase, [DI_SYMBOLS.ILevelsRepository]);

    //* Controllers
    levelsModule
        .bind(DI_SYMBOLS.IGetLevelsController)
        .toHigherOrderFunction(getLevelsController, [
            DI_SYMBOLS.IGetLevelsUseCase,
        ]);

    levelsModule
        .bind(DI_SYMBOLS.IGetLevelController)
        .toHigherOrderFunction(getLevelController, [
            DI_SYMBOLS.IGetLevelUseCase,
        ]);

    return levelsModule;
};
