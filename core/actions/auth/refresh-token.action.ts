"use server";

import { cookies } from "next/headers";

import { getInjection } from "@/di/container";
import { UnauthenticatedError } from "@/src/entities/errors/auth";

/**
 * Server action pour vérifier la validité de l'accessToken et rafraîchir les tokens si nécessaire
 * Vérifie d'abord si l'accessToken est encore valide avant de rafraîchir
 */
export async function refreshTokenAction(): Promise<void> {
    try {
        const cookieStore = await cookies();

        // Récupérer l'access token depuis les cookies
        const accessToken = cookieStore.get("accessToken")?.value;

        // Si un access token est présent, ne rien faire
        if (accessToken) {
            return;
        }

        // Récupérer le refresh token depuis les cookies
        const refreshToken = cookieStore.get("refreshToken")?.value;

        // Si aucun refresh token n'est présent, ne rien faire
        if (!refreshToken) {
            // refresh token invalide ou absent
            return;
        }

        // Utiliser le refresh token controller pour obtenir de nouveaux tokens
        const refreshTokenController = getInjection("IRefreshTokenController");

        const result = await refreshTokenController(refreshToken);

        // Mettre à jour les cookies avec les nouveaux tokens
        // Définir le cookie d'access token
        cookieStore.set(
            result.accessTokenCookie.name,
            result.accessTokenCookie.value,
            {
                secure: result.accessTokenCookie.attributes.secure,
                path: result.accessTokenCookie.attributes.path,
                domain: result.accessTokenCookie.attributes.domain,
                sameSite: result.accessTokenCookie.attributes.sameSite,
                httpOnly: result.accessTokenCookie.attributes.httpOnly,
                maxAge: result.accessTokenCookie.attributes.maxAge,
                expires: result.accessTokenCookie.attributes.expires,
            }
        );

        // Définir le cookie de refresh token
        cookieStore.set(
            result.refreshTokenCookie.name,
            result.refreshTokenCookie.value,
            {
                secure: result.refreshTokenCookie.attributes.secure,
                path: result.refreshTokenCookie.attributes.path,
                domain: result.refreshTokenCookie.attributes.domain,
                sameSite: result.refreshTokenCookie.attributes.sameSite,
                httpOnly: result.refreshTokenCookie.attributes.httpOnly,
                maxAge: result.refreshTokenCookie.attributes.maxAge,
                expires: result.refreshTokenCookie.attributes.expires,
            }
        );

        // Définir le cookie de user
        cookieStore.set(result.userCookie.name, result.userCookie.value, {
            secure: result.userCookie.attributes.secure,
            path: result.userCookie.attributes.path,
            domain: result.userCookie.attributes.domain,
            sameSite: result.userCookie.attributes.sameSite,
            httpOnly: result.userCookie.attributes.httpOnly,
            maxAge: result.userCookie.attributes.maxAge,
            expires: result.userCookie.attributes.expires,
        });
    } catch (error) {
        // En cas d'erreur, ne pas interrompre le processus
        // Les erreurs de rafraîchissement sont gérées silencieusement
        if (error instanceof UnauthenticatedError) {
            // Token de rafraîchissement invalide, ne rien faire
            return;
        }

        throw error;
    }
}
