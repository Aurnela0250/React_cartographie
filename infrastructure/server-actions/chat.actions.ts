"use server";

import { ChatInput } from "@/core/entities/chat.entity";
import { ChatApiRepository } from "@/infrastructure/repositories/chat.repository";
import { getServerActionSession } from "@/infrastructure/server-actions/get-session.action";

const repo = new ChatApiRepository();

async function getTokenServerSide(): Promise<string> {
    const session = await getServerActionSession();

    if (!session.isLoggedIn || !session.token?.accessToken) {
        throw new Error("Non authentifié");
    }

    return session.token.accessToken;
}

export async function sendChatMessage(data: ChatInput) {
    const token = await getTokenServerSide();
    const chat = await repo.sendMessage(token, data);

    return { ...chat };
}

export async function getChatHistory() {
    const token = await getTokenServerSide();
    const history = await repo.getHistory(token);

    return { ...history };
}
