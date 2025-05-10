"use server";

import { SectorApiRepository } from "@/infrastructure/repositories/sector.repository";
import { getServerActionSession } from "@/infrastructure/server-actions/get-session.action";

const repo = new SectorApiRepository();

async function getTokenServerSide(): Promise<string> {
    const session = await getServerActionSession();

    if (!session.isLoggedIn || !session.token?.accessToken) {
        throw new Error("Non authentifié");
    }

    return session.token.accessToken;
}

export async function createSector(data: { name: string; city_id: number }) {
    const token = await getTokenServerSide();
    const sector = await repo.create(token, data);

    return { ...sector };
}

export async function updateSector(
    id: number,
    data: { name?: string; city_id?: number }
) {
    const token = await getTokenServerSide();
    const sector = await repo.update(token, id, data);

    return { ...sector };
}

export async function deleteSector(id: number) {
    const token = await getTokenServerSide();

    return repo.delete(token, id);
}
