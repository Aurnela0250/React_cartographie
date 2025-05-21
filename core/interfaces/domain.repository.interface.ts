import { Domain } from "@/core/entities/domain.entity";
import { PaginatedResult, PaginationParams } from "@/core/entities/pagination";

export interface IDomainRepository {
    getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<Domain>>;
    get(token: string, id: number): Promise<Domain>;
    create(
        token: string,
        data: { name: string; description?: string }
    ): Promise<Domain>;
    update(
        token: string,
        id: number,
        data: { name?: string; description?: string }
    ): Promise<Domain>;
    delete(token: string, id: number): Promise<boolean>;
}
