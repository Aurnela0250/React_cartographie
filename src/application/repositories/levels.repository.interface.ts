import { LevelFilter } from "@/src/entities/filters/level.filter";
import { Level } from "@/src/entities/models/level.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export interface ILevelsRepository {
    getLevels(
        token: string,
        options?: {
            params?: PaginationParams;
        }
    ): Promise<PaginatedResult<Level>>;
    getLevel(token: string, id: number): Promise<Level>;
    createLevel(
        token: string,
        data: {
            name: string;
            acronym?: string;
        }
    ): Promise<Level>;
    updateLevel(
        token: string,
        id: number,
        data: {
            name?: string;
            acronym?: string;
        }
    ): Promise<Level>;
    deleteLevel(token: string, id: number): Promise<boolean>;
    filterLevels(
        token: string,
        options?: {
            params?: PaginationParams;
            filters?: LevelFilter;
        }
    ): Promise<PaginatedResult<Level>>;
}
