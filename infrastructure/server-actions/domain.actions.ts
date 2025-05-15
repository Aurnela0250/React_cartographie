"use server";

import { DomainApiRepository } from "@/infrastructure/repositories/domain.repository";
import { getServerActionSession } from "@/infrastructure/server-actions/get-session.action";

const repo = new DomainApiRepository();

async function getTokenServerSide(): Promise<string> {
    const session = await getServerActionSession();

    if (!session.isLoggedIn || !session.token?.accessToken) {
        throw new Error("Non authentifié");
    }

    return session.token.accessToken;
}

export async function createDomain(data: { name: string }) {
    const token = await getTokenServerSide();
    const domain = await repo.create(token, data);

    return { ...domain };
}

export async function updateDomain(id: number, data: { name?: string }) {
    const token = await getTokenServerSide();
    const domain = await repo.update(token, id, data);

    return { ...domain };
}

export async function deleteDomain(id: number) {
    const token = await getTokenServerSide();

    return repo.delete(token, id);
}
