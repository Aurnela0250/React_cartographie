"use server";

import { EstablishmentApiRepository } from "@/infrastructure/repositories/establishment.repository";
import { getServerActionSession } from "@/infrastructure/server-actions/get-session.action";

async function getTokenServerSide(): Promise<string> {
    const session = await getServerActionSession();

    if (!session.isLoggedIn || !session.token?.accessToken) {
        throw new Error("Non authentifié");
    }

    return session.token.accessToken;
}
const repository = new EstablishmentApiRepository();

export async function createEstablishment(data: {
    name: string;
    acronyme?: string;
    address: string;
    contact?: string;
    site_url?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    establishment_type_id: number;
    sector_id: number;
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
        contact?: string;
        site_url?: string;
        description?: string;
        latitude?: number;
        longitude?: number;
        establishment_type_id?: number;
        sector_id?: number;
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
