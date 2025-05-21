import {
    ChatEntity,
    ChatHistoryResponse,
    ChatInput,
    ChatResponse,
} from "@/core/entities/chat.entity";
import { IChatRepository } from "@/core/interfaces/chat.repository.interface";
import { env } from "@/env.mjs";
import { toCamelCaseRecursive, toSnakeCaseRecursive } from "@/shared/utils";
import { handleApiResponse } from "@/shared/utils/api-errors";

export class ChatApiRepository implements IChatRepository {
    async sendMessage(token: string, data: ChatInput): Promise<ChatResponse> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/chat`;
        const payload = toSnakeCaseRecursive(data);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const res = await handleApiResponse<unknown>(response);

        return ChatEntity.fromResponse(toCamelCaseRecursive(res));
    }

    async getHistory(token: string): Promise<ChatHistoryResponse> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/chat/history`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const res = await handleApiResponse<unknown>(response);

        return ChatEntity.fromHistory(toCamelCaseRecursive(res));
    }
}
