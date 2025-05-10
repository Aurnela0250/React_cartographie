import { NextRequest, NextResponse } from "next/server";

import { EstablishmentTypeApiRepository } from "@/infrastructure/repositories/establishment-type.repository";
import { getRouteHandlerSession } from "@/shared/utils/auth";

const repo = new EstablishmentTypeApiRepository();

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

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { message: "Non authentifié" },
            { status: 401 }
        );
    }
}
