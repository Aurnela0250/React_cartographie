"use server";

import { DomainApiRepository } from "@/infrastructure/repositories/domain.repository";

import { getTokenServerSide } from "./token";

const repo = new DomainApiRepository();

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
