import { NextRequest, NextResponse } from "next/server";

import { EstablishmentApiRepository } from "@/infrastructure/repositories/establishment.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

const repo = new EstablishmentApiRepository();

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const id = parseInt(params.id);
        const body = await req.json();

        if (!body.rating || typeof body.rating !== "number") {
            return NextResponse.json(
                { message: "Une note valide est requise" },
                { status: 400 }
            );
        }

        await repo.rate(accessToken, id, {
            rating: body.rating,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        const errorMsg =
            error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}
