import { NextResponse } from "next/server";

import { AuthDjangoApiRepository } from "@/infrastructure/repositories/auth.repository";
import { getServerActionSession } from "@/infrastructure/server-actions/get-session.action";

const authRepository = new AuthDjangoApiRepository();

export async function POST() {
    try {
        const session = await getServerActionSession();

        // Récupérer le refreshToken pour la déconnexion backend
        const refreshToken = session.token?.refreshToken;
        const accessToken = session.token?.accessToken;

        // Appel au backend pour invalider la session si possible
        if (accessToken && refreshToken) {
            try {
                await authRepository.logout(accessToken, refreshToken);
            } catch (backendError) {
                console.warn(
                    "Échec de déconnexion backend, poursuite avec destruction de session côté client:",
                    backendError
                );
            }
        }

        // Détruire la session
        session.destroy();

        // Rediriger vers la page de login
        return NextResponse.redirect(
            new URL(
                "/login",
                process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            )
        );
    } catch (error) {
        console.error("Erreur API Logout:", error);

        // Rediriger vers la page de login même en cas d'erreur
        return NextResponse.redirect(
            new URL(
                "/login",
                process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            )
        );
    }
}
