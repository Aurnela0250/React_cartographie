import { NextRequest, NextResponse } from "next/server";

import { EstablishmentApiRepository } from "@/infrastructure/repositories/establishment.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

const repo = new EstablishmentApiRepository();

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    try {
        const id = parseInt(params.id);
        const establishment = await repo.get(accessToken, id);

        const plainEstablishment = JSON.parse(JSON.stringify(establishment));

        return NextResponse.json(plainEstablishment);
    } catch (error) {
        const errorMsg =
            error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    try {
        const id = parseInt(params.id);
        const body = await req.json();

        const establishment = await repo.update(accessToken, id, body);

        const plainEstablishment = JSON.parse(JSON.stringify(establishment));

        return NextResponse.json(plainEstablishment);
    } catch (error) {
        const errorMsg =
            error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    try {
        const id = parseInt(params.id);

        const result = await repo.delete(accessToken, id);

        return NextResponse.json({ success: result });
    } catch (error) {
        const errorMsg =
            error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}
