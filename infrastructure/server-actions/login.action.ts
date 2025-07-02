"use server";

import { cookies } from "next/headers";

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

// Instancier le repository
const authRepository = new AuthDjangoApiRepository();

export const login = actionClient
    .schema(loginSchema)
    .action(async ({ parsedInput: { email, password } }) => {
        try {
            // Appeler directement le repository
            const tokenData = await authRepository.login({ email, password });

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

            // Mettre à jour les cookies
            const getTimeUntilExpiry = (exp: number): number => {
                const currentTimeUTC = Math.floor(
                    Date.UTC(
                        new Date().getUTCFullYear(),
                        new Date().getUTCMonth(),
                        new Date().getUTCDate(),
                        new Date().getUTCHours(),
                        new Date().getUTCMinutes(),
                        new Date().getUTCSeconds()
                    ) / 1000
                );

                return Math.max(0, exp - currentTimeUTC);
            };

            const timeUntilExpiry = getTimeUntilExpiry(tokenData.exp);

            const cookieStore = await cookies();

            cookieStore.set("accessToken", tokenData.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: timeUntilExpiry,
                path: "/",
            });

            cookieStore.set("refreshToken", tokenData.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60, // 7 jours
                path: "/",
            });

            cookieStore.set(
                "tokenMeta",
                JSON.stringify({
                    exp: tokenData.exp,
                    iat: tokenData.iat,
                    userId: tokenData.userId,
                }),
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: getTimeUntilExpiry(tokenData.exp),
                    path: "/",
                }
            );

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
