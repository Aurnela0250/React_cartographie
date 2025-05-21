import {
    ChatHistoryResponse,
    ChatInput,
    ChatResponse,
} from "@/core/entities/chat.entity";

export interface IChatRepository {
    sendMessage(token: string, data: ChatInput): Promise<ChatResponse>;
    getHistory(token: string): Promise<ChatHistoryResponse>;
}
