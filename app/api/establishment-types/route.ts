import { NextRequest, NextResponse } from "next/server";

import { EstablishmentTypeApiRepository } from "@/infrastructure/repositories/establishment-type.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

const repo = new EstablishmentTypeApiRepository();

async function authHandler() {
    const { accessToken } = await getAuthTokens();

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
    try {
        const { accessToken } = await getAuthTokens();

        if (!accessToken) {
            return {
                error: NextResponse.json(
                    { message: "Token manquant" },
                    { status: 401 }
                ),
            };
        }

        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || 1);
        const perPage = Number(searchParams.get("per_page") || 100);

        const data = await repo.getAll(accessToken, { page, perPage });

        return NextResponse.json(data);
    } catch (error) {
        const errorMsg =
            error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}
