import { CityFilter } from "@/src/entities/filters/city.filter";
import { City } from "@/src/entities/models/city.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export interface ICitiesRepository {
    getCities(
        token: string,
        options?: {
            params: PaginationParams;
        }
    ): Promise<PaginatedResult<City>>;
    getCity(token: string, id: number): Promise<City>;
    createCity(
        token: string,
        data: {
            name: string;
            regionId: number;
        }
    ): Promise<City>;
    updateCity(
        token: string,
        id: number,
        data: {
            name?: string;
            regionId?: number;
        }
    ): Promise<City>;
    deleteCity(token: string, id: number): Promise<boolean>;
    filterCities(
        token: string,
        options?: {
            params?: PaginationParams;
            filters?: CityFilter;
        }
    ): Promise<PaginatedResult<City>>;
}
