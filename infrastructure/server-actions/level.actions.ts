"use server";

import { LevelApiRepository } from "@/infrastructure/repositories/level.repository";

import { getTokenServerSide } from "./token";

const repo = new LevelApiRepository();

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
