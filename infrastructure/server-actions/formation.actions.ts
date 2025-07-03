"use server";

import { IFormation } from "@/core/entities/formation.entity";
import { FormationApiRepository } from "@/infrastructure/repositories/formation.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

// --- Formation Authorization actions ---
export async function createFormationAuthorization(
    formationId: number,
    data: {
        dateDebut: string;
        dateFin?: string;
        status: "REQUESTED" | "VALIDATED" | "REFUSED" | "EXPIRED";
        arrete?: string;
    }
) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }
    // Nettoyage des champs vides
    const cleanData = {
        ...data,
        dateFin: data.dateFin === "" ? undefined : data.dateFin,
        arrete: data.arrete === "" ? undefined : data.arrete,
    };

    const formation = await repo.createFormationAuthorization(
        accessToken,
        formationId,
        cleanData
    );

    return { ...formation };
}

export async function updateFormationAuthorization(
    formationId: number,
    data: {
        dateDebut?: string;
        dateFin?: string;
        status?: "REQUESTED" | "VALIDATED" | "REFUSED" | "EXPIRED";
        arrete?: string;
    }
) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }
    // Nettoyage des champs vides
    const cleanData = {
        ...data,
        dateFin: data.dateFin === "" ? undefined : data.dateFin,
        arrete: data.arrete === "" ? undefined : data.arrete,
    };

    const formation = await repo.updateFormationAuthorization(
        accessToken,
        formationId,
        cleanData
    );

    return { ...formation };
}

// --- Annual Headcount actions ---
export async function createAnnualHeadcount(
    formationId: number,
    data: { academicYear: number; students: number }
) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    const formation = await repo.createFormationAnnualHeadCount(
        accessToken,
        formationId,
        data
    );

    return { ...formation };
}

export async function updateAnnualHeadcount(
    formationId: number,
    id: number,
    data: { academicYear?: number; students?: number }
) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    const formation = await repo.updateFormationAnnualHeadCount(
        accessToken,
        formationId,
        id,
        data
    );

    return { ...formation };
}

export async function deleteAnnualHeadcount(formationId: number, id: number) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    return await repo.deleteFormationAnnualHeadCount(
        accessToken,
        formationId,
        id
    );
}

const repo = new FormationApiRepository();

export async function createFormation(data: {
    name: string;
    description?: string;
    duration: number;
    levelId: number;
    mentionId: number;
    establishmentId: number;
    authorizationId?: number;
}) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    const formation = await repo.create(accessToken, data);

    return { ...formation };
}

export async function updateFormation(
    id: number,
    data: Partial<
        Omit<
            IFormation,
            | "id"
            | "createdAt"
            | "updatedAt"
            | "createdBy"
            | "updatedBy"
            | "level"
            | "mention"
            | "establishment"
            | "authorization"
            | "annualHeadcounts"
        >
    >
) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    const formation = await repo.update(accessToken, id, data);

    return { ...formation };
}

export async function deleteFormation(id: number) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        throw new Error("Non authentifié");
    }

    return await repo.delete(accessToken, id);
}
