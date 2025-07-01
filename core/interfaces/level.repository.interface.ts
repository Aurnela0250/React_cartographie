import { Level } from "@/core/entities/level.entity";
import { PaginatedResult, PaginationParams } from "@/core/entities/pagination";

import { LevelFilter } from "../filters/level.filter";

export interface ILevelRepository {
    getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<Level>>;
    get(token: string, id: number): Promise<Level>;
    create(
        token: string,
        data: {
            name: string;
            acronym?: string;
        }
    ): Promise<Level>;
    update(
        token: string,
        id: number,
        data: {
            name?: string;
            acronym?: string;
        }
    ): Promise<Level>;
    delete(token: string, id: number): Promise<boolean>;
    filter(
        token: string,
        filters: LevelFilter
    ): Promise<PaginatedResult<Level>>;
}
