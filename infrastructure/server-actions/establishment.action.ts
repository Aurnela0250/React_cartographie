"use server";

import { Rate } from "@/core/entities/rate.entity";
import { EstablishmentApiRepository } from "@/infrastructure/repositories/establishment.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

const repository = new EstablishmentApiRepository();

export async function createEstablishment(data: {
    name: string;
    acronym?: string;
    address: string;
    contacts?: string[];
    website?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    establishmentTypeId: number;
    cityId: number;
}) {
    try {
        const { accessToken } = await getAuthTokens();

        if (!accessToken) {
            throw new Error("Non authentifié");
        }

        const establishment = await repository.create(accessToken, data);

        return { ...establishment };
    } catch (error) {
        console.error("Error creating establishment:", error);
        throw new Error("Failed to create establishment");
    }
}

export async function updateEstablishment(
    id: number,
    data: {
        name: string;
        acronym?: string;
        address?: string;
        contacts?: string[];
        website?: string;
        description?: string;
        latitude?: number;
        longitude?: number;
        establishmentTypeId: number;
        cityId: number;
    }
) {
    try {
        const { accessToken } = await getAuthTokens();

        if (!accessToken) {
            throw new Error("Non authentifié");
        }

        const establishment = await repository.update(accessToken, id, data);

        return { ...establishment };
    } catch (error) {
        console.error("Error updating establishment:", error);
        throw new Error("Failed to update establishment");
    }
}

export async function deleteEstablishment(id: number): Promise<boolean> {
    try {
        const { accessToken } = await getAuthTokens();

        if (!accessToken) {
            throw new Error("Non authentifié");
        }

        return await repository.delete(accessToken, id);
    } catch (error) {
        console.error("Error deleting establishment:", error);
        throw new Error("Failed to delete establishment");
    }
}

export async function rateEstablishment(
    id: number,
    rating: number
): Promise<Rate> {
    try {
        const { accessToken } = await getAuthTokens();

        if (!accessToken) {
            throw new Error("Non authentifié");
        }

        return await repository.rate(accessToken, id, { rating });
    } catch (error) {
        console.error("Error rating establishment:", error);
        throw new Error("Failed to rate establishment");
    }
}
