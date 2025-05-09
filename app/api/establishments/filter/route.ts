import { NextRequest, NextResponse } from "next/server";

import { EstablishmentApiRepository } from "@/infrastructure/repositories/establishment.repository";
import { getRouteHandlerSession } from "@/shared/utils/auth";

const repo = new EstablishmentApiRepository();

async function getTokenFromRequest(req: NextRequest): Promise<string> {
    const session = await getRouteHandlerSession(req);

    if (!session.isLoggedIn || !session.token?.accessToken) {
        throw new Error("Non authentifié");
    }

    return session.token.accessToken;
}

export async function GET(req: NextRequest) {
    try {
        const token = await getTokenFromRequest(req);
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || 1);
        const perPage = Number(searchParams.get("per_page") || 10);

        const filters = {
            name: searchParams.get("name") || undefined,
            acronyme: searchParams.get("acronyme") || undefined,
            establishment_type_id: searchParams.get("establishment_type_id")
                ? parseInt(searchParams.get("establishment_type_id")!)
                : undefined,
            city_id: searchParams.get("city_id")
                ? parseInt(searchParams.get("city_id")!)
                : undefined,
            region_id: searchParams.get("region_id")
                ? parseInt(searchParams.get("region_id")!)
                : undefined,
        };

        const data = await repo.filter(token, { page, perPage }, filters);

        // Convertir l'instance de classe en objet JavaScript simple
        const plainData = JSON.parse(JSON.stringify(data));

        return NextResponse.json(plainData);
    } catch (error) {
        return NextResponse.json(
            { message: "Non authentifié" },
            { status: 401 }
        );
    }
}
