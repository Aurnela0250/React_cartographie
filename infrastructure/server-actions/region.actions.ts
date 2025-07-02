"use server";

import { RegionApiRepository } from "@/infrastructure/repositories/region.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

const repo = new RegionApiRepository();

export async function createRegion(data: { name: string }) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    const region = await repo.create(accessToken, data);

    return { ...region };
}

export async function updateRegion(id: number, data: { name: string }) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    const region = await repo.update(accessToken, id, data);

    return { ...region };
}

export async function deleteRegion(id: number) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    return repo.delete(accessToken, id);
}
