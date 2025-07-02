import { NextRequest, NextResponse } from "next/server";
import { instanceToPlain } from "class-transformer";

import { RegionApiRepository } from "@/infrastructure/repositories/region.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

const repo = new RegionApiRepository();

export async function GET(req: NextRequest) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        return new NextResponse("Unauthorized", { status: 401 });
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
            error instanceof Error
                ? error.message
                : "An unexpected error occurred";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const region = await repo.create(accessToken, body);

        // Convertir l'instance de classe en objet simple
        const plainRegion = instanceToPlain(region);

        return NextResponse.json(plainRegion);
    } catch (error) {
        const errorMsg =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}
