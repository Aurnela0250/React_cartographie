import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { EstablishmentApiRepository } from "@/infrastructure/repositories/establishment.repository";
import { getCurrentUser } from "@/shared/utils/auth-utils";

const repo = new EstablishmentApiRepository();

async function authHandler() {
    const user = await getCurrentUser();

    if (!user) {
        return {
            error: NextResponse.json(
                { message: "Non authentifié" },
                { status: 401 }
            ),
        };
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return {
            error: NextResponse.json(
                { message: "Token manquant" },
                { status: 401 }
            ),
        };
    }

    return { accessToken };
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const authResult = await authHandler();

    if (authResult.error) return authResult.error;
    const { accessToken } = authResult;

    try {
        const id = parseInt(params.id);
        const establishment = await repo.get(accessToken, id);

        // Convertir l'instance de classe en objet JavaScript simple
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
    const authResult = await authHandler();

    if (authResult.error) return authResult.error;
    const { accessToken } = authResult;

    try {
        const id = parseInt(params.id);
        const body = await req.json();

        const establishment = await repo.update(accessToken, id, body);

        // Convertir l'instance de classe en objet simple
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
    const authResult = await authHandler();

    if (authResult.error) return authResult.error;
    const { accessToken } = authResult;

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
