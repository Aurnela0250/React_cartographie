"use server";

import { DomainApiRepository } from "@/infrastructure/repositories/domain.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

const repo = new DomainApiRepository();

export async function createDomain(data: { name: string }) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }
    const domain = await repo.create(accessToken, data);

    return { ...domain };
}

export async function updateDomain(id: number, data: { name?: string }) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }
    const domain = await repo.update(accessToken, id, data);

    return { ...domain };
}

export async function deleteDomain(id: number) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    return repo.delete(accessToken, id);
}
