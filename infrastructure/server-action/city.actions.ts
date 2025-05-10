"use server";

import { CityApiRepository } from "@/infrastructure/repositories/city.repository";
import { getServerActionSession } from "@/infrastructure/server-actions/get-session.action";

const repo = new CityApiRepository();

async function getTokenServerSide(): Promise<string> {
    const session = await getServerActionSession();

    if (!session.isLoggedIn || !session.token?.accessToken) {
        throw new Error("Non authentifié");
    }

    return session.token.accessToken;
}

export async function createCity(data: { name: string; region_id: number }) {
    const token = await getTokenServerSide();
    const city = await repo.create(token, data);

    return { ...city };
}

export async function updateCity(
    id: number,
    data: { name?: string; region_id?: number }
) {
    const token = await getTokenServerSide();
    const city = await repo.update(token, id, data);

    return { ...city };
}

export async function deleteCity(id: number) {
    const token = await getTokenServerSide();

    return repo.delete(token, id);
}
