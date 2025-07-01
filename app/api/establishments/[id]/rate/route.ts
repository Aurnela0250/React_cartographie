import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { EstablishmentApiRepository } from "@/infrastructure/repositories/establishment.repository";
import { getCurrentUser } from "@/shared/utils/auth-utils";

const repo = new EstablishmentApiRepository();

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return NextResponse.json({ error: "Token manquant" }, { status: 401 });
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

        const result = await repo.rate(accessToken, id, {
            rating: body.rating,
        });

        return NextResponse.json({ success: result });
    } catch (error) {
        const errorMsg =
            error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}
