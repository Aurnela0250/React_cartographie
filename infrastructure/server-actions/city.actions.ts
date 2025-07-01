"use server";

import { CityApiRepository } from "@/infrastructure/repositories/city.repository";

import { getTokenServerSide } from "./token";

const repo = new CityApiRepository();

export async function createCity(data: { name: string; regionId: number }) {
    const token = await getTokenServerSide();
    const city = await repo.create(token, {
        name: data.name,
        regionId: data.regionId,
    });

    return { ...city };
}

export async function updateCity(
    id: number,
    data: { name?: string; regionId?: number }
) {
    const token = await getTokenServerSide();
    const city = await repo.update(token, id, {
        name: data.name,
        regionId: data.regionId,
    });

    return { ...city };
}

export async function deleteCity(id: number) {
    const token = await getTokenServerSide();

    return repo.delete(token, id);
}
