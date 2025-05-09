import { Mention } from "@/core/domain/entities/mention.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/core/domain/entities/pagination";

export interface IMentionRepository {
    getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<Mention>>;
    get(token: string, id: number): Promise<Mention>;
    create(
        token: string,
        data: { name: string; domain_id: number }
    ): Promise<Mention>;
    update(
        token: string,
        id: number,
        data: { name?: string; domain_id?: number }
    ): Promise<Mention>;
    delete(token: string, id: number): Promise<boolean>;
}
