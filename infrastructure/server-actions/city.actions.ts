"use server";

import { CityApiRepository } from "@/infrastructure/repositories/city.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

const repo = new CityApiRepository();

export async function createCity(data: { name: string; regionId: number }) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }
    const city = await repo.create(accessToken, {
        name: data.name,
        regionId: data.regionId,
    });

    return { ...city };
}

export async function updateCity(
    id: number,
    data: { name?: string; regionId?: number }
) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }
    const city = await repo.update(accessToken, id, {
        name: data.name,
        regionId: data.regionId,
    });

    return { ...city };
}

export async function deleteCity(id: number) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    return repo.delete(accessToken, id);
}
