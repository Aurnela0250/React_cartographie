import { env } from "@/env.mjs";
import {
    handleApiResponse,
    toCamelCaseRecursive,
    toSnakeCaseRecursive,
} from "@/shared/utils";
import { IMentionsRepository } from "@/src/application/repositories/mention.repository.interface";
import { MentionFilter } from "@/src/entities/filters/mention.filter";
import { Mention } from "@/src/entities/models/mention.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export class MentionsRepository implements IMentionsRepository {
    getMentions(
        token: string,
        options?: { params?: PaginationParams }
    ): Promise<PaginatedResult<Mention>> {
        throw new Error("Method not implemented.");
    }
    async getMention(token: string, id: number): Promise<Mention> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/mentions/${id}`;

        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            next: {
                tags: ["mention", `id:${id}`],
            },
        });
        const data = await handleApiResponse<Mention>(response);

        const result = toCamelCaseRecursive(data);

        return result;
    }
    createMention(
        token: string,
        data: { name: string; domainId: number }
    ): Promise<Mention> {
        throw new Error("Method not implemented.");
    }
    updateMention(
        token: string,
        id: number,
        data: { name?: string; domainId?: number }
    ): Promise<Mention> {
        throw new Error("Method not implemented.");
    }
    deleteMention(token: string, id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    filterMentions(
        token: string,
        options?: {
            params?: PaginationParams;
            filters?: MentionFilter;
        }
    ): Promise<PaginatedResult<Mention>> {
        throw new Error("Method not implemented.");
    }
}
