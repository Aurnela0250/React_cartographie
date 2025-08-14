import { NextRequest, NextResponse } from "next/server";

import { AuthTokenService } from "@/infrastructure/services/auth-token.service";

export async function GET(_: NextRequest) {
    try {
        // Utiliser le service centralisé pour vérifier l'authentification
        // et récupérer l'utilisateur avec refresh automatique si nécessaire
        const authService = AuthTokenService.getInstance();
        const authResult = await authService.isAuthenticated();

        if (!authResult.authenticated) {
            return NextResponse.json(
                { 
                    error: "Non authentifié",
                    requiresLogin: authResult.requiresLogin || false 
                },
                { status: 401 }
            );
        }

        // Retourner les données utilisateur
        return NextResponse.json(authResult.user);
    } catch (error) {
        console.error(
            "Me: Erreur lors de la récupération des données utilisateur:",
            error
        );

        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
