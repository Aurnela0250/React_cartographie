"use server";

import { EstablishmentApiRepository } from "@/infrastructure/repositories/establishment.repository";

import { getTokenServerSide } from "./token";

const repository = new EstablishmentApiRepository();

export async function createEstablishment(data: {
    name: string;
    acronyme?: string;
    address: string;
    contacts?: string[];
    siteUrl?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    establishmentTypeId: number;
    sectorId: number;
}) {
    try {
        const token = await getTokenServerSide();

        const establishment = await repository.create(token, data);

        return { ...establishment };
    } catch (error) {
        console.error("Error creating establishment:", error);
        throw new Error("Failed to create establishment");
    }
}

export async function updateEstablishment(
    id: number,
    data: {
        name?: string;
        acronyme?: string;
        address?: string;
        contacts?: string[];
        siteUrl?: string;
        description?: string;
        latitude?: number;
        longitude?: number;
        establishmentTypeId?: number;
        sectorId?: number;
    }
) {
    try {
        const token = await getTokenServerSide();

        const establishment = await repository.update(token, id, data);

        return { ...establishment };
    } catch (error) {
        console.error("Error updating establishment:", error);
        throw new Error("Failed to update establishment");
    }
}

export async function deleteEstablishment(id: number): Promise<boolean> {
    try {
        const token = await getTokenServerSide();

        return await repository.delete(token, id);
    } catch (error) {
        console.error("Error deleting establishment:", error);
        throw new Error("Failed to delete establishment");
    }
}

export async function rateEstablishment(
    id: number,
    rating: number
): Promise<boolean> {
    try {
        const token = await getTokenServerSide();

        return await repository.rate(token, id, { rating });
    } catch (error) {
        console.error("Error rating establishment:", error);
        throw new Error("Failed to rate establishment");
    }
}
