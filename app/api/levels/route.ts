import { NextRequest, NextResponse } from "next/server";

import { LevelApiRepository } from "@/infrastructure/repositories/level.repository";
import { getServerActionSession } from "@/infrastructure/server-actions/get-session.action";

const repo = new LevelApiRepository();

async function getTokenOrThrow() {
    const session = await getServerActionSession();

    if (!session.isLoggedIn || !session.token?.accessToken) {
        return null;
    }

    return session.token.accessToken;
}

export async function GET(req: NextRequest) {
    const token = await getTokenOrThrow();

    if (!token)
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const perPage = Number(searchParams.get("per_page")) || 10;
    const result = await repo.getAll(token, { page, perPage });

    return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
    const token = await getTokenOrThrow();

    if (!token)
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const body = await req.json();
    // Remplacer 'code' par 'acronyme' si besoin (compatibilité front)
    const { name, code, acronyme, ...rest } = body;
    const data = { name, acronyme: acronyme ?? code, ...rest };
    const level = await repo.create(token, data);

    return NextResponse.json(level);
}
