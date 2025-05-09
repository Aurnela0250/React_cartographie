"use server";

import { AuthDjangoApiRepository } from "@/infrastructure/repositories/auth.repository";
import { actionClient } from "@/infrastructure/services/safe-action";
import { loginSchema } from "@/presentation/schemas/auth.schema";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { UnauthorizedError } from "@/shared/utils/api-errors.types";
// Plus besoin d'importer ces erreurs car on retourne directement des objets d'erreur
// import {
//     InternalServerError,
//     InvalidCredentialError,
// } from "@/shared/utils/app-errors";
import { tokenToSessionData } from "@/shared/utils/auth";

import { getServerActionSession } from "./get-session.action";

// Instancier le repository
const authRepository = new AuthDjangoApiRepository();

export const login = actionClient
    .schema(loginSchema)
    .action(async ({ parsedInput: { email, password } }) => {
        try {
            // Appeler directement le repository
            const tokenData = await authRepository.login(email, password);

            // Vérifier que les données de token sont complètes
            if (
                !tokenData ||
                !tokenData.accessToken ||
                !tokenData.refreshToken ||
                !tokenData.exp
            ) {
                return {
                    success: false,
                    error: "Échec de connexion: données de token incomplètes.",
                };
            }

            // Obtenir la session
            const session = await getServerActionSession();

            // Convertir le token en données de session et les stocker
            const sessionData = tokenToSessionData(tokenData);

            // Mettre à jour la session
            session.isLoggedIn = sessionData.isLoggedIn;
            session.token = sessionData.token;
            session.user = sessionData.user;

            // Sauvegarder la session
            await session.save();

            // Retourner succès et URL de redirection
            return { success: true, redirectTo: DEFAULT_LOGIN_REDIRECT };
        } catch (error: unknown) {
            // Nous gardons une trace de l'erreur en mode développement
            if (process.env.NODE_ENV === "development") {
                console.error("Erreur Login Action:", error);
            }

            // Gérer les erreurs spécifiques
            if (error instanceof UnauthorizedError) {
                return {
                    success: false,
                    error: "Email ou mot de passe incorrect",
                };
            }

            return {
                success: false,
                error: "Une erreur est survenue lors de la connexion",
            };
        }
    });
