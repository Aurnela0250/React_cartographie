import { IGetCitiesUseCase } from "@/src/application/use-cases/cities/get-cities.use-case";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { City } from "@/src/entities/models/city.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export type IGetCitiesController = ReturnType<typeof getCitiesController>;

export const getCitiesController =
    (getCitiesUseCase: IGetCitiesUseCase) =>
    async (
        token: string | undefined,
        options?: {
            params: PaginationParams;
        }
    ): Promise<PaginatedResult<City>> => {
        if (!token) {
            throw new UnauthenticatedError("Must be logged in");
        }

        const cities = await getCitiesUseCase(token, options);

        return cities;
    };
