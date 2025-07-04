import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { CityApiRepository } from "@/infrastructure/repositories/city.repository";
import { getCurrentUser } from "@/shared/utils/auth-utils";

const repo = new CityApiRepository();

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
        const data = await repo.getAll(accessToken, { page, perPage });
        const plainData = JSON.parse(JSON.stringify(data));

        return NextResponse.json(plainData);
    } catch (error) {
        const errorMsg =
            error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
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
        const body = await req.json();
        const city = await repo.create(accessToken, body);

        return NextResponse.json(city);
    } catch (error) {
        const errorMsg =
            error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}
