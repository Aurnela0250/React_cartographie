import { ICitiesRepository } from "@/src/application/repositories/cities.repository.interface";
import { City } from "@/src/entities/models/city.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export type IGetCitiesUseCase = ReturnType<typeof getCitiesUseCase>;

export const getCitiesUseCase =
    (cityRepository: ICitiesRepository) =>
    async (
        token: string,
        options?: {
            params: PaginationParams;
        }
    ): Promise<PaginatedResult<City>> => {
        // TODO: Check the permission if is valid

        const cities = await cityRepository.getCities(token, options);

        return cities;
    };
