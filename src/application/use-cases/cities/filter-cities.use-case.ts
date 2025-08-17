import { ICitiesRepository } from "@/src/application/repositories/cities.repository.interface";
import { CityFilter } from "@/src/entities/filters/city.filter";
import { City } from "@/src/entities/models/city.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export type IFilterCitiesUseCase = ReturnType<typeof filterCitiesUseCase>;

export const filterCitiesUseCase =
    (cityRepository: ICitiesRepository) =>
    async (
        token: string,
        options?: {
            params?: PaginationParams;
            filters?: CityFilter;
        }
    ): Promise<PaginatedResult<City>> => {
        // TODO: Check the permission if is valid

        const cities = await cityRepository.filterCities(token, options);

        return cities;
    };
