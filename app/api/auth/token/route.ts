import { NextRequest, NextResponse } from "next/server";

import { getRouteHandlerSession } from "@/shared/utils/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getRouteHandlerSession(request);

        // Vérifier si l'utilisateur est connecté
        if (!session.isLoggedIn || !session.token?.accessToken) {
            return NextResponse.json(
                { message: "Non authentifié" },
                { status: 401 }
            );
        }

        // Retourner uniquement le token d'accès
        return NextResponse.json({ token: session.token.accessToken });
    } catch (error) {
        console.error("Erreur API Token GET:", error);

        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
