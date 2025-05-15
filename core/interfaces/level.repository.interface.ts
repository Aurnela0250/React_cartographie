import { Level } from "@/core/entities/level.entity";
import { PaginatedResult, PaginationParams } from "@/core/entities/pagination";

export interface ILevelRepository {
    getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<Level>>;
    get(token: string, id: number): Promise<Level>;
    create(
        token: string,
        data: { name: string; acronyme?: string }
    ): Promise<Level>;
    update(
        token: string,
        id: number,
        data: { name?: string; acronyme?: string }
    ): Promise<Level>;
    delete(token: string, id: number): Promise<boolean>;
}
