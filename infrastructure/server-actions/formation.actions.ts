"use server";

import { IFormation } from "@/core/entities/formation.entity";
import { FormationApiRepository } from "@/infrastructure/repositories/formation.repository";

import { getTokenServerSide } from "./token";

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
    const token = await getTokenServerSide();
    // Nettoyage des champs vides
    const cleanData = {
        ...data,
        dateFin: data.dateFin === "" ? undefined : data.dateFin,
        arrete: data.arrete === "" ? undefined : data.arrete,
    };

    const formation = await repo.createFormationAuthorization(
        token,
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
    const token = await getTokenServerSide();
    // Nettoyage des champs vides
    const cleanData = {
        ...data,
        dateFin: data.dateFin === "" ? undefined : data.dateFin,
        arrete: data.arrete === "" ? undefined : data.arrete,
    };

    const formation = await repo.updateFormationAuthorization(
        token,
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
    const token = await getTokenServerSide();

    const formation = await repo.createFormationAnnualHeadCount(
        token,
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
    const token = await getTokenServerSide();

    const formation = await repo.updateFormationAnnualHeadCount(
        token,
        formationId,
        id,
        data
    );

    return { ...formation };
}

export async function deleteAnnualHeadcount(formationId: number, id: number) {
    const token = await getTokenServerSide();

    return await repo.deleteFormationAnnualHeadCount(token, formationId, id);
}

const repo = new FormationApiRepository();

export async function createFormation(data: {
    intitule: string;
    description?: string;
    duration: number;
    levelId: number;
    mentionId: number;
    establishmentId: number;
    authorizationId?: number;
}) {
    const token = await getTokenServerSide();
    const formation = await repo.create(token, data);

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
    const token = await getTokenServerSide();
    const formation = await repo.update(token, id, data);

    return { ...formation };
}

export async function deleteFormation(id: number) {
    const token = await getTokenServerSide();

    return await repo.delete(token, id);
}
