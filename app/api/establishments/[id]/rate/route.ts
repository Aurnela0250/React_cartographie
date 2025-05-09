import { NextRequest, NextResponse } from "next/server";

import { EstablishmentApiRepository } from "@/infrastructure/repositories/establishment.repository";
import { getRouteHandlerSession } from "@/shared/utils/auth";

const repo = new EstablishmentApiRepository();

async function getTokenFromRequest(req: NextRequest): Promise<string> {
    const session = await getRouteHandlerSession(req);

    if (!session.isLoggedIn || !session.token?.accessToken) {
        throw new Error("Non authentifié");
    }

    return session.token.accessToken;
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = await getTokenFromRequest(req);
        const id = parseInt(params.id);
        const body = await req.json();

        if (!body.rating || typeof body.rating !== "number") {
            return NextResponse.json(
                { message: "Une note valide est requise" },
                { status: 400 }
            );
        }

        const result = await repo.rate(token, id, { rating: body.rating });

        return NextResponse.json({ success: result });
    } catch (error) {
        return NextResponse.json(
            { message: "Non authentifié" },
            { status: 401 }
        );
    }
}
