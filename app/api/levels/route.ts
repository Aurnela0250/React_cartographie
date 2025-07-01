import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { LevelApiRepository } from "@/infrastructure/repositories/level.repository";
import { getCurrentUser } from "@/shared/utils/auth-utils";

const repo = new LevelApiRepository();

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
        const page = Number(searchParams.get("page")) || 1;
        const perPage = Number(searchParams.get("per_page")) || 10;

        console.log("Levels: page", page);
        const result = await repo.getAll(accessToken, { page, perPage });

        return NextResponse.json(result);
    } catch (error) {
        const errorMsg =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const authResult = await authHandler();

    if (authResult.error) return authResult.error;
    const { accessToken } = authResult;

    try {
        const body = await req.json();
        // Remplacer 'code' par 'acronyme' si besoin (compatibilité front)
        const { name, acronym, ...rest } = body;
        const data = { name, acronym, ...rest };
        const level = await repo.create(accessToken, data);

        return NextResponse.json(level);
    } catch (error) {
        const errorMsg =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}
