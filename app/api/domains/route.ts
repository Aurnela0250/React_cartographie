import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { instanceToPlain } from "class-transformer";

import { DomainApiRepository } from "@/infrastructure/repositories/domain.repository";
import { getCurrentUser } from "@/shared/utils/auth-utils";

const repo = new DomainApiRepository();

async function authHandler() {
    const user = await getCurrentUser();

    if (!user) {
        return {
            error: NextResponse.json(
                { message: "Non authentifié" },
                { status: 401 }
            ),
        };
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return {
            error: NextResponse.json(
                { message: "Token manquant" },
                { status: 401 }
            ),
        };
    }

    return { accessToken };
}

export async function GET(req: NextRequest) {
    const authResult = await authHandler();

    if (authResult.error) return authResult.error;
    const { accessToken } = authResult;

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
    const authResult = await authHandler();

    if (authResult.error) return authResult.error;
    const { accessToken } = authResult;

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
