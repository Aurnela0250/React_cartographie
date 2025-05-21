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

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const token = await getTokenOrThrow();

    if (!token)
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const id = Number(params.id);

    if (!id)
        return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    const level = await repo.get(token, id);

    return NextResponse.json(level);
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const token = await getTokenOrThrow();

    if (!token)
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const id = Number(params.id);

    if (!id)
        return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    const body = await req.json();
    // Remplacer 'code' par 'acronyme' si besoin (compatibilité front)
    const { name, code, acronyme, ...rest } = body;
    const data = { name, acronyme: acronyme ?? code, ...rest };
    const level = await repo.update(token, id, data);

    return NextResponse.json(level);
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const token = await getTokenOrThrow();

    if (!token)
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const id = Number(params.id);

    if (!id)
        return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    await repo.delete(token, id);

    return NextResponse.json({ success: true });
}
