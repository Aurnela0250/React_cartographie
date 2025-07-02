"use server";

import { EstablishmentTypeApiRepository } from "@/infrastructure/repositories/establishment-type.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

const repo = new EstablishmentTypeApiRepository();

export async function createEstablishmentType(data: {
    name: string;
    description?: string;
}) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }
    const establishmentType = await repo.create(accessToken, data);

    return { ...establishmentType };
}

export async function updateEstablishmentType(
    id: number,
    data: { name?: string; description?: string }
) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }
    const establishmentType = await repo.update(accessToken, id, data);

    return { ...establishmentType };
}

export async function deleteEstablishmentType(id: number) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    return repo.delete(accessToken, id);
}
