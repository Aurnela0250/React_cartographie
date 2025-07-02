"use server";

import { MentionApiRepository } from "@/infrastructure/repositories/mention.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

const repo = new MentionApiRepository();

export async function createMention(data: { name: string; domainId: number }) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    const mention = await repo.create(accessToken, data);

    return { ...mention };
}

export async function updateMention(
    id: number,
    data: { name?: string; domainId?: number }
) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    const mention = await repo.update(accessToken, id, data);

    return { ...mention };
}

export async function deleteMention(id: number) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    return repo.delete(accessToken, id);
}
