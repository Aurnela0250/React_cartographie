"use server";

import { AuthDjangoApiRepository } from "@/infrastructure/repositories/auth.repository";
import { actionClient } from "@/infrastructure/services/safe-action";
import { InternalServerError } from "@/shared/utils/app-errors";

import { getServerActionSession } from "./get-session.action";

const authRepository = new AuthDjangoApiRepository();

export const logout = actionClient.action(async () => {
    try {
        const session = await getServerActionSession();

        // Récupérer le refreshToken pour le déconnexion backend
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

        return { success: true };
    } catch (error) {
        console.error("Erreur Action Logout:", error);
        throw new InternalServerError(
            "Une erreur est survenue lors de la déconnexion"
        );
    }
});
