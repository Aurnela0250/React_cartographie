"use server";

import { ChatInput } from "@/core/entities/chat.entity";
import { ChatApiRepository } from "@/infrastructure/repositories/chat.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

const repo = new ChatApiRepository();

export async function sendChatMessage(data: ChatInput) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    const chat = await repo.sendMessage(accessToken, data);

    return { ...chat };
}

export async function getChatHistory() {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    const history = await repo.getHistory(accessToken);

    return { ...history };
}
