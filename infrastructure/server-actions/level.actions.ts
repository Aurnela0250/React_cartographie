"use server";

import { LevelApiRepository } from "@/infrastructure/repositories/level.repository";
import { getServerActionSession } from "@/infrastructure/server-actions/get-session.action";

const repo = new LevelApiRepository();

async function getTokenServerSide(): Promise<string> {
    const session = await getServerActionSession();

    if (!session.isLoggedIn || !session.token?.accessToken) {
        throw new Error("Non authentifié");
    }

    return session.token.accessToken;
}

export async function createLevel(data: { name: string; acronyme?: string }) {
    const token = await getTokenServerSide();
    const level = await repo.create(token, data);

    return { ...level };
}

export async function updateLevel(
    id: number,
    data: { name?: string; acronyme?: string }
) {
    const token = await getTokenServerSide();
    const level = await repo.update(token, id, data);

    return { ...level };
}

export async function deleteLevel(id: number) {
    const token = await getTokenServerSide();

    return repo.delete(token, id);
}
