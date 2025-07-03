import { NextRequest, NextResponse } from "next/server";

import { LevelApiRepository } from "@/infrastructure/repositories/level.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

const repo = new LevelApiRepository();

export async function GET(req: NextRequest) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        return NextResponse.json(
            { message: "Non authentifié" },
            { status: 401 }
        );
    }

    try {
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page")) || 1;
        const perPage = Number(searchParams.get("per_page")) || 10;

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
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        return NextResponse.json(
            { message: "Non authentifié" },
            { status: 401 }
        );
    }

    try {
        const body = await req.json();
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
