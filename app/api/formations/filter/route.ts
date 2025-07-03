import { NextRequest, NextResponse } from "next/server";

import { EstablishmentFilter } from "@/core/filters/establishment.filter";
import { FormationFilter } from "@/core/filters/formation.filter";
import { EstablishmentApiRepository } from "@/infrastructure/repositories/establishment.repository";
import { FormationApiRepository } from "@/infrastructure/repositories/formation.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

const repo = new FormationApiRepository();

export async function GET(req: NextRequest) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);

        const filters: FormationFilter = {
            page: Number(searchParams.get("page") || 1),
            perPage: Number(searchParams.get("perPage") || 10),
            nameContains: searchParams.get("name") || undefined,
            descriptionContains: searchParams.get("description") || undefined,
            duration: searchParams.get("duration")
                ? parseInt(searchParams.get("duration")!)
                : undefined,
            durationMin: searchParams.get("durationMin")
                ? parseInt(searchParams.get("durationMin")!)
                : undefined,
            durationMax: searchParams.get("durationMax")
                ? parseInt(searchParams.get("durationMax")!)
                : undefined,
            levelId: searchParams.get("levelId")
                ? parseInt(searchParams.get("levelId")!)
                : undefined,
            mentionId: searchParams.get("mentionId")
                ? parseInt(searchParams.get("mentionId")!)
                : undefined,
            establishmentId: searchParams.get("establishmentId")
                ? parseInt(searchParams.get("establishmentId")!)
                : undefined,
            authorizationId: searchParams.get("authorizationId")
                ? parseInt(searchParams.get("authorizationId")!)
                : undefined,
            createdBy: searchParams.get("createdBy")
                ? parseInt(searchParams.get("createdBy")!)
                : undefined,
            updatedBy: searchParams.get("updatedBy")
                ? parseInt(searchParams.get("updatedBy")!)
                : undefined,
            createdAtAfter: searchParams.get("createdAtAfter")
                ? new Date(searchParams.get("createdAtAfter")!)
                : undefined,
            createdAtBefore: searchParams.get("createdAtBefore")
                ? new Date(searchParams.get("createdAtBefore")!)
                : undefined,
            updatedAtAfter: searchParams.get("updatedAtAfter")
                ? new Date(searchParams.get("updatedAtAfter")!)
                : undefined,
            updatedAtBefore: searchParams.get("updatedAtBefore")
                ? new Date(searchParams.get("updatedAtBefore")!)
                : undefined,
        };

        const data = await repo.filter(accessToken, filters);

        const plainData = JSON.parse(JSON.stringify(data));

        return NextResponse.json(plainData);
    } catch (error) {
        const errorMsg =
            error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}
