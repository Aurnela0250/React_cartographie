import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { AuthDjangoApiRepository } from "@/infrastructure/repositories/auth.repository";

const authRepository = new AuthDjangoApiRepository();

export async function POST(_: NextRequest) {
    try {
        const cookieStore = await cookies();

        // Récupérer les tokens depuis les cookies
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        // Si on a des tokens, appeler l'API de déconnexion
        if (accessToken && refreshToken) {
            try {
                await authRepository.logout(accessToken, refreshToken);
            } catch (error) {
                // On log l'erreur mais on continue la déconnexion côté client
                console.error(
                    "Erreur lors de la déconnexion côté serveur:",
                    error
                );
            }
        }

        // Nettoyer tous les cookies d'authentification
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
        cookieStore.delete("user");
        cookieStore.delete("tokenMeta");

        return NextResponse.json({
            success: true,
            message: "Déconnexion réussie",
        });
    } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);

        // Même en cas d'erreur, on nettoie les cookies locaux
        const cookieStore = await cookies();

        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
        cookieStore.delete("user");
        cookieStore.delete("tokenMeta");

        return NextResponse.json({
            success: true,
            message: "Déconnexion réussie (cookies nettoyés)",
        });
    }
}
