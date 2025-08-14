// Chat Entity basé sur l'exemple Python fourni
import { z } from 'zod';

// Zod schemas for Chat entities
export const ChatFormationSchema = z.object({
    title: z.string(),
    level: z.string(),
    domainMention: z.string(),
    durationMonths: z.number().optional(),
    authorizationStatus: z.string(),
});

export const ChatFoundDataSchema = z.object({
    establishmentName: z.string(),
    establishmentAcronym: z.string(),
    type: z.string(),
    sector: z.string(),
    address: z.string(),
    formations: z.array(ChatFormationSchema),
});

export const ChatResponseDataSchema = z.object({
    assistantMessage: z.string(),
    foundData: z.array(ChatFoundDataSchema),
    clarificationQuestion: z.string().nullable(),
});

export const ChatResponseSchema = z.object({
    userId: z.number(),
    response: ChatResponseDataSchema,
    history: z.array(z.string()),
});

export const ChatHistoryResponseSchema = z.object({
    userId: z.number(),
    history: z.array(z.string()),
});

export const ChatInputSchema = z.object({
    message: z.string(),
});

// Type inference from Zod schemas
export type ChatFormation = z.infer<typeof ChatFormationSchema>;
export type ChatFoundData = z.infer<typeof ChatFoundDataSchema>;
export type ChatResponseData = z.infer<typeof ChatResponseDataSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type ChatHistoryResponse = z.infer<typeof ChatHistoryResponseSchema>;
export type ChatInput = z.infer<typeof ChatInputSchema>;

export class ChatEntity {
    static fromResponse(data: unknown): ChatResponse {
        return ChatResponseSchema.parse(data);
    }

    static validateChatInput(data: unknown): ChatInput {
        return ChatInputSchema.parse(data);
    }

    static validateChatHistoryResponse(data: unknown): ChatHistoryResponse {
        return ChatHistoryResponseSchema.parse(data);
    }

    static validateChatFormation(data: unknown): ChatFormation {
        return ChatFormationSchema.parse(data);
    }

    static validateChatFoundData(data: unknown): ChatFoundData {
        return ChatFoundDataSchema.parse(data);
    }

    static validateChatResponseData(data: unknown): ChatResponseData {
        return ChatResponseDataSchema.parse(data);
    }

    static fromHistory(data: unknown): ChatHistoryResponse {
        return ChatHistoryResponseSchema.parse(data);
    }
}
