import { MentionFilter } from "@/src/entities/filters/mention.filter";
import { Mention } from "@/src/entities/models/mention.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export interface IMentionsRepository {
    getMentions(
        token: string,
        options?: {
            params?: PaginationParams;
        }
    ): Promise<PaginatedResult<Mention>>;
    getMention(token: string, id: number): Promise<Mention>;
    createMention(
        token: string,
        data: {
            name: string;
            domainId: number;
        }
    ): Promise<Mention>;
    updateMention(
        token: string,
        id: number,
        data: {
            name?: string;
            domainId?: number;
        }
    ): Promise<Mention>;
    deleteMention(token: string, id: number): Promise<boolean>;
    filterMentions(
        token: string,
        options?: {
            params?: PaginationParams;
            filters?: MentionFilter;
        }
    ): Promise<PaginatedResult<Mention>>;
}
