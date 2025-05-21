"use server";

import { MentionApiRepository } from "@/infrastructure/repositories/mention.repository";
import { getServerActionSession } from "@/infrastructure/server-actions/get-session.action";

const repo = new MentionApiRepository();

async function getTokenServerSide(): Promise<string> {
    const session = await getServerActionSession();

    if (!session.isLoggedIn || !session.token?.accessToken) {
        throw new Error("Non authentifié");
    }

    return session.token.accessToken;
}

export async function createMention(data: { name: string; domainId: number }) {
    const token = await getTokenServerSide();
    const mention = await repo.create(token, data);

    return { ...mention };
}

export async function updateMention(
    id: number,
    data: { name?: string; domainId?: number }
) {
    const token = await getTokenServerSide();
    const mention = await repo.update(token, id, data);

    return { ...mention };
}

export async function deleteMention(id: number) {
    const token = await getTokenServerSide();

    return repo.delete(token, id);
}
