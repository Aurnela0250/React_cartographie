import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { AuthDjangoApiRepository } from "@/infrastructure/repositories/auth.repository";

const authRepository = new AuthDjangoApiRepository();

export async function GET(_: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        // Le middleware garantit que le token est présent et valide
        if (!accessToken) {
            return NextResponse.json(
                { error: "Non authentifié - token manquant" },
                { status: 401 }
            );
        }

        // Récupérer les données utilisateur directement depuis l'API backend
        const user = await authRepository.me(accessToken);

        return NextResponse.json(user);
    } catch (error) {
        console.error(
            "Me: Erreur lors de la récupération des données utilisateur:",
            error
        );

        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
