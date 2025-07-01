import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { EstablishmentApiRepository } from "@/infrastructure/repositories/establishment.repository";
import { getCurrentUser } from "@/shared/utils/auth-utils";

const repo = new EstablishmentApiRepository();

export async function GET(req: NextRequest) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || 1);
        const perPage = Number(searchParams.get("per_page") || 10);

        const filters = {
            name: searchParams.get("name") || undefined,
            acronyme: searchParams.get("acronyme") || undefined,
            establishmentTypeId: searchParams.get("establishment_type_id")
                ? parseInt(searchParams.get("establishment_type_id")!)
                : undefined,
            cityId: searchParams.get("city_id")
                ? parseInt(searchParams.get("city_id")!)
                : undefined,
            regionId: searchParams.get("region_id")
                ? parseInt(searchParams.get("region_id")!)
                : undefined,
        };

        const data = await repo.filter(accessToken, { page, perPage }, filters);

        // Convertir l'instance de classe en objet JavaScript simple
        const plainData = JSON.parse(JSON.stringify(data));

        return NextResponse.json(plainData);
    } catch (error) {
        const errorMsg =
            error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}
