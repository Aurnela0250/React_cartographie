"use server";

import { EstablishmentTypeApiRepository } from "@/infrastructure/repositories/establishment-type.repository";
import { getServerActionSession } from "@/infrastructure/server-actions/get-session.action";

const repo = new EstablishmentTypeApiRepository();

async function getTokenServerSide(): Promise<string> {
    const session = await getServerActionSession();

    if (!session.isLoggedIn || !session.token?.accessToken) {
        throw new Error("Non authentifié");
    }

    return session.token.accessToken;
}

export async function createEstablishmentType(data: {
    name: string;
    description?: string;
}) {
    const token = await getTokenServerSide();
    const establishmentType = await repo.create(token, data);

    return { ...establishmentType };
}

export async function updateEstablishmentType(
    id: number,
    data: { name?: string; description?: string }
) {
    const token = await getTokenServerSide();
    const establishmentType = await repo.update(token, id, data);

    return { ...establishmentType };
}

export async function deleteEstablishmentType(id: number) {
    const token = await getTokenServerSide();

    return repo.delete(token, id);
}
