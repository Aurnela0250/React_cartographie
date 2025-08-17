import { filterCitiesUseCase } from "@/src/application/use-cases/cities/filter-cities.use-case";
import { getCitiesUseCase } from "@/src/application/use-cases/cities/get-cities.use-case";
import { filterCitiesController } from "@/src/controllers/cities/filter-cities.controller";
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

    citiesModule
        .bind(DI_SYMBOLS.IFilterCitiesUseCase)
        .toHigherOrderFunction(filterCitiesUseCase, [
            DI_SYMBOLS.ICitiesRepository,
        ]);

    citiesModule
        .bind(DI_SYMBOLS.IFilterCitiesController)
        .toHigherOrderFunction(filterCitiesController, [
            DI_SYMBOLS.IFilterCitiesUseCase,
        ]);

    return citiesModule;
};
