import { NextRequest, NextResponse } from "next/server";

import { SectorApiRepository } from "@/infrastructure/repositories/sector.repository";
import { getRouteHandlerSession } from "@/shared/utils/auth";

const repo = new SectorApiRepository();

async function getTokenFromRequest(req: NextRequest): Promise<string> {
    const session = await getRouteHandlerSession(req);

    if (!session.isLoggedIn || !session.token?.accessToken) {
        throw new Error("Non authentifié");
    }

    return session.token.accessToken;
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = await getTokenFromRequest(req);
        const sector = await repo.get(token, Number(params.id));

        return NextResponse.json(sector);
    } catch (error) {
        return NextResponse.json(
            { message: "Non authentifié" },
            { status: 401 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = await getTokenFromRequest(req);
        const body = await req.json();
        const sector = await repo.update(token, Number(params.id), body);

        return NextResponse.json(sector);
    } catch (error) {
        return NextResponse.json(
            { message: "Non authentifié" },
            { status: 401 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = await getTokenFromRequest(req);

        await repo.delete(token, Number(params.id));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { message: "Non authentifié" },
            { status: 401 }
        );
    }
}
