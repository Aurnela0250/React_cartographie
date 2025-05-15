"use server";

import { RegionApiRepository } from "@/infrastructure/repositories/region.repository";
import { getServerActionSession } from "@/infrastructure/server-actions/get-session.action";

const repo = new RegionApiRepository();

async function getTokenServerSide(): Promise<string> {
    const session = await getServerActionSession();

    if (!session.isLoggedIn || !session.token?.accessToken) {
        throw new Error("Non authentifié");
    }

    return session.token.accessToken;
}

export async function createRegion(data: { name: string; code?: string }) {
    const token = await getTokenServerSide();
    const region = await repo.create(token, data);

    return { ...region };
}

export async function updateRegion(
    id: number,
    data: { name?: string; code?: string }
) {
    const token = await getTokenServerSide();
    const region = await repo.update(token, id, data);

    return { ...region };
}

export async function deleteRegion(id: number) {
    const token = await getTokenServerSide();

    return repo.delete(token, id);
}
