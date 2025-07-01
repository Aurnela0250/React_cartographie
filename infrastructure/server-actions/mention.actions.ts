"use server";

import { MentionApiRepository } from "@/infrastructure/repositories/mention.repository";

import { getTokenServerSide } from "./token";

const repo = new MentionApiRepository();

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
