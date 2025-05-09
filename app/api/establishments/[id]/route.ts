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

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = await getTokenFromRequest(req);
        const id = parseInt(params.id);

        const establishment = await repo.get(token, id);

        // Convertir l'instance de classe en objet JavaScript simple
        const plainEstablishment = JSON.parse(JSON.stringify(establishment));

        return NextResponse.json(plainEstablishment);
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
        const id = parseInt(params.id);
        const body = await req.json();

        const establishment = await repo.update(token, id, body);

        // Convertir l'instance de classe en objet simple
        const plainEstablishment = JSON.parse(JSON.stringify(establishment));

        return NextResponse.json(plainEstablishment);
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
        const id = parseInt(params.id);

        const result = await repo.delete(token, id);

        return NextResponse.json({ success: result });
    } catch (error) {
        return NextResponse.json(
            { message: "Non authentifié" },
            { status: 401 }
        );
    }
}
