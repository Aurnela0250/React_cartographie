"use server";

import { LevelApiRepository } from "@/infrastructure/repositories/level.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

const repo = new LevelApiRepository();

export async function createLevel(data: { name: string; acronyme?: string }) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    const level = await repo.create(accessToken, data);

    return { ...level };
}

export async function updateLevel(
    id: number,
    data: { name?: string; acronyme?: string }
) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    const level = await repo.update(accessToken, id, data);

    return { ...level };
}

export async function deleteLevel(id: number) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    return repo.delete(accessToken, id);
}
