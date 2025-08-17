import { IFilterCitiesUseCase } from "@/src/application/use-cases/cities/filter-cities.use-case";
import { IGetCitiesUseCase } from "@/src/application/use-cases/cities/get-cities.use-case";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { CityFilter } from "@/src/entities/filters/city.filter";
import { City } from "@/src/entities/models/city.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export type IFilterCitiesController = ReturnType<typeof filterCitiesController>;

export const filterCitiesController =
    (filterCitiesUseCase: IFilterCitiesUseCase) =>
    async (
        token: string | undefined,
        options?: {
            params?: PaginationParams;
            filters?: CityFilter;
        }
    ): Promise<PaginatedResult<City>> => {
        if (!token) {
            throw new UnauthenticatedError("Must be logged in");
        }

        const cities = await filterCitiesUseCase(token, options);

        return cities;
    };
