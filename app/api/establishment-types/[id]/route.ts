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

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = await getTokenFromRequest(req);
        const establishmentType = await repo.get(token, Number(params.id));

        return NextResponse.json(establishmentType);
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
        const establishmentType = await repo.update(
            token,
            Number(params.id),
            body
        );

        return NextResponse.json(establishmentType);
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
