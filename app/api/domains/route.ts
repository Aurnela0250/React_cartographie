import { NextRequest, NextResponse } from "next/server";
import { instanceToPlain } from "class-transformer";

import { DomainApiRepository } from "@/infrastructure/repositories/domain.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

const repo = new DomainApiRepository();

export async function GET(req: NextRequest) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        return NextResponse.json(
            { message: "Token manquant" },
            { status: 401 }
        );
    }

    try {
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || 1);
        const perPage = Number(searchParams.get("per_page") || 100);

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
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        return NextResponse.json(
            { message: "Token manquant" },
            { status: 401 }
        );
    }

    try {
        const body = await req.json();
        const domain = await repo.create(accessToken, body);
        const plainDomain = instanceToPlain(domain);

        return NextResponse.json(plainDomain);
    } catch (error) {
        const errorMsg =
            error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}
