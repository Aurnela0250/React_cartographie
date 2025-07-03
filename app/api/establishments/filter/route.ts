import { NextRequest, NextResponse } from "next/server";

import { EstablishmentFilter } from "@/core/filters/establishment.filter";
import { EstablishmentApiRepository } from "@/infrastructure/repositories/establishment.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

const repo = new EstablishmentApiRepository();

export async function GET(req: NextRequest) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);

        const filters: EstablishmentFilter = {
            page: Number(searchParams.get("page") || 1),
            perPage: Number(searchParams.get("per_page") || 10),
            nameContains: searchParams.get("name") || undefined,
            acronymContains: searchParams.get("acronym") || undefined,
            establishmentTypeId: searchParams.get("establishmentTypeId")
                ? parseInt(searchParams.get("establishmentTypeId")!)
                : undefined,
            cityId: searchParams.get("cityId")
                ? parseInt(searchParams.get("cityId")!)
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
