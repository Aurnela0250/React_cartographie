import { NextRequest, NextResponse } from "next/server";

import { AuthTokenService } from "@/infrastructure/services/auth-token.service";

export async function POST(_: NextRequest) {
    try {
        // Utiliser le service centralisé pour la déconnexion
        const authService = AuthTokenService.getInstance();

        await authService.logout();

        return NextResponse.json({
            success: true,
            message: "Déconnexion réussie",
        });
    } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);

        // En cas d'erreur, forcer le nettoyage des cookies
        try {
            const authService = AuthTokenService.getInstance();

            await authService.clearTokens();
        } catch (clearError) {
            console.error("Erreur lors du nettoyage des cookies:", clearError);
        }

        return NextResponse.json({
            success: true,
            message: "Déconnexion réussie (cookies nettoyés)",
        });
    }
}
