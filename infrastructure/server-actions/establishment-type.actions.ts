"use server";

import { EstablishmentTypeApiRepository } from "@/infrastructure/repositories/establishment-type.repository";

import { getTokenServerSide } from "./token";

const repo = new EstablishmentTypeApiRepository();

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
