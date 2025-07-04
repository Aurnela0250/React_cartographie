import { Mention } from "@/core/entities/mention.entity";
import { PaginatedResult, PaginationParams } from "@/core/entities/pagination";

import { MentionFilter } from "../filters/mention.filter";

export interface IMentionRepository {
    getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<Mention>>;
    get(token: string, id: number): Promise<Mention>;
    create(
        token: string,
        data: {
            name: string;
            domainId: number;
        }
    ): Promise<Mention>;
    update(
        token: string,
        id: number,
        data: {
            name?: string;
            domainId?: number;
        }
    ): Promise<Mention>;
    delete(token: string, id: number): Promise<void>;
    filter(
        token: string,
        filters: MentionFilter
    ): Promise<PaginatedResult<Mention>>;
}
