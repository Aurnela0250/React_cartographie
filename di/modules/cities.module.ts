import { getCitiesUseCase } from "@/src/application/use-cases/cities/get-cities.use-case";
import { getCitiesController } from "@/src/controllers/cities/get-cities.controller";
import { CitiesRepository } from "@/src/infrastructure/repositories/cities.repository";
import { createModule } from "@evyweb/ioctopus";

import { DI_SYMBOLS } from "../types";

export const createCitiesModule = () => {
    const citiesModule = createModule();

    citiesModule.bind(DI_SYMBOLS.ICitiesRepository).toClass(CitiesRepository);

    citiesModule
        .bind(DI_SYMBOLS.IGetCitiesUseCase)
        .toHigherOrderFunction(getCitiesUseCase, [
            DI_SYMBOLS.ICitiesRepository,
        ]);

    citiesModule
        .bind(DI_SYMBOLS.IGetCitiesController)
        .toHigherOrderFunction(getCitiesController, [
            DI_SYMBOLS.IGetCitiesUseCase,
        ]);

    return citiesModule;
};
