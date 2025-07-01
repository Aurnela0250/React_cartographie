"use server";

import { SectorApiRepository } from "@/infrastructure/repositories/sector.repository";

import { getTokenServerSide } from "./token";

const repo = new SectorApiRepository();

export async function createSector(data: { name: string; cityId: number }) {
    const token = await getTokenServerSide();
    const sector = await repo.create(token, data);

    return { ...sector };
}

export async function updateSector(
    id: number,
    data: { name?: string; cityId?: number }
) {
    const token = await getTokenServerSide();
    const sector = await repo.update(token, id, data);

    return { ...sector };
}

export async function deleteSector(id: number) {
    const token = await getTokenServerSide();

    return repo.delete(token, id);
}
