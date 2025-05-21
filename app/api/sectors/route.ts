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

export async function GET(req: NextRequest) {
    try {
        const token = await getTokenFromRequest(req);
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || 1);
        const perPage = Number(searchParams.get("per_page") || 10);
        const data = await repo.getAll(token, { page, perPage });
        const plainData = JSON.parse(JSON.stringify(data));

        return NextResponse.json(plainData);
    } catch (error) {
        return NextResponse.json(
            { message: "Non authentifié" },
            { status: 401 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const token = await getTokenFromRequest(req);
        const body = await req.json();
        const sector = await repo.create(token, body);

        return NextResponse.json(sector);
    } catch (error) {
        return NextResponse.json(
            { message: "Non authentifié" },
            { status: 401 }
        );
    }
}
