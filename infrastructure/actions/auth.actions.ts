import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import { User } from "@/core/entities/users.entity";
import { AuthDjangoApiRepository as AuthApiRepository } from "@/infrastructure/repositories/auth.repository";
import { ServiceResult } from "@/shared/types/service-result";

/**
 * Server Actions pour l'authentification avec gestion complète des cookies
 * Utilise React cache pour optimiser les performances
 */

/**
 * Interface pour le résultat de vérification de session
 */
export interface SessionResult {
    isAuthenticated: boolean;
    user?: User;
    accessToken?: string;
    error?: string;
    requiresLogin?: boolean;
}

/**
 * Vérifie la session utilisateur avec mise en cache (READ-ONLY)
 * Ne modifie PAS les cookies - version sécurisée pour les Server Components
 */
export const verifySession = cache(async (): Promise<SessionResult> => {
    try {
        const cookieStore = await cookies();

        // Récupérer les tokens depuis les cookies
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!accessToken) {
            return {
                isAuthenticated: false,
                error: "Aucun token d'accès",
                requiresLogin: true,
            };
        }

        // Valider le token access
        const authRepository = new AuthApiRepository();

        try {
            // Tenter la validation du token
            const user = await authRepository.me(accessToken);

            // NE PAS stocker l'utilisateur en cookie ici (read-only)
            // Le stockage doit se faire dans une vraie Server Action

            return {
                isAuthenticated: true,
                user,
                accessToken,
            };
        } catch (error) {
            console.log("Token invalide, refresh nécessaire...");

            // Token invalide → ne pas faire le refresh automatiquement
            // Car nous sommes en mode read-only
            return {
                isAuthenticated: false,
                error: "Token expiré, reconnexion nécessaire",
                requiresLogin: true,
            };
        }
    } catch (error) {
        console.error("Erreur lors de la vérification de session:", error);

        return {
            isAuthenticated: false,
            error: "Erreur lors de la vérification",
            requiresLogin: true,
        };
    }
});

/**
 * Tente de rafraîchir le token automatiquement
 */
async function attemptTokenRefresh(
    refreshToken: string
): Promise<SessionResult> {
    try {
        const authRepository = new AuthApiRepository();
        const tokensResponse = await authRepository.refresh(refreshToken);

        // Stocker les nouveaux tokens
        await storeTokensInCookies(
            tokensResponse.accessToken,
            tokensResponse.refreshToken
        );

        // Récupérer les informations utilisateur avec le nouveau token
        const user = await authRepository.me(tokensResponse.accessToken);

        // Stocker l'utilisateur
        await storeUserInCookies(user);

        console.log("Token refresh réussi");

        return {
            isAuthenticated: true,
            user,
            accessToken: tokensResponse.accessToken,
        };
    } catch (error) {
        console.error("Échec du refresh token:", error);

        // Nettoyer les cookies invalides
        await clearAuthCookies();

        return {
            isAuthenticated: false,
            error: "Session expirée",
            requiresLogin: true,
        };
    }
}

/**
 * Stocke les tokens dans les cookies de manière sécurisée
 */
async function storeTokensInCookies(
    accessToken: string,
    refreshToken: string
): Promise<void> {
    const cookieStore = await cookies();

    // Configuration sécurisée des cookies
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        path: "/",
    };

    cookieStore.set("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60, // 15 minutes
    });

    cookieStore.set("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60, // 7 jours
    });
}

/**
 * Stocke les informations utilisateur dans les cookies
 */
async function storeUserInCookies(user: User): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set("user", JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 15 * 60, // 15 minutes
    });
}

/**
 * Nettoie tous les cookies d'authentification
 */
async function clearAuthCookies(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("user");
}

/**
 * Récupère l'utilisateur depuis les cookies
 */
export const getUserFromCookies = cache(async (): Promise<User | null> => {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("user")?.value;

        if (!userCookie) {
            return null;
        }

        return JSON.parse(userCookie) as User;
    } catch (error) {
        console.error("Erreur lors de la récupération utilisateur:", error);
        return null;
    }
});

/**
 * Vérifie si l'utilisateur a une permission spécifique
 */
export const checkUserPermission = cache(
    async (
        permission: "READ" | "WRITE" | "ADMIN"
    ): Promise<ServiceResult<boolean>> => {
        const sessionResult = await verifySession();

        if (!sessionResult.isAuthenticated || !sessionResult.user) {
            return ServiceResult.error("Utilisateur non authentifié");
        }

        const user = sessionResult.user;

        switch (permission) {
            case "READ":
                return ServiceResult.success(user.active);
            case "WRITE":
                return ServiceResult.success(user.active);
            case "ADMIN":
                return ServiceResult.success(user.active && user.isAdmin);
            default:
                return ServiceResult.error("Permission inconnue");
        }
    }
);

/**
 * Action de connexion
 */
export async function loginAction(
    email: string,
    password: string
): Promise<ServiceResult<User>> {
    try {
        const authRepository = new AuthApiRepository();
        const tokensResponse = await authRepository.login({
            email,
            password,
        });

        // Stocker les tokens
        await storeTokensInCookies(
            tokensResponse.accessToken,
            tokensResponse.refreshToken
        );

        // Récupérer les informations utilisateur
        const user = await authRepository.me(tokensResponse.accessToken);

        // Stocker l'utilisateur
        await storeUserInCookies(user);

        return ServiceResult.success(user);
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Erreur de connexion";
        return ServiceResult.error(errorMessage);
    }
}

/**
 * Action de déconnexion
 */
export async function logoutAction(): Promise<ServiceResult<boolean>> {
    try {
        await clearAuthCookies();
        return ServiceResult.success(true);
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Erreur de déconnexion";
        return ServiceResult.error(errorMessage);
    }
}

/**
 * Server Action pour rafraîchir le token
 * Peut modifier les cookies car c'est une vraie Server Action
 */
export async function refreshTokenAction(): Promise<
    ServiceResult<SessionResult>
> {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) {
            return ServiceResult.error("Aucun token de refresh disponible");
        }

        const authRepository = new AuthApiRepository();
        const tokensResponse = await authRepository.refresh(refreshToken);

        // Stocker les nouveaux tokens
        await storeTokensInCookies(
            tokensResponse.accessToken,
            tokensResponse.refreshToken
        );

        // Récupérer les informations utilisateur avec le nouveau token
        const user = await authRepository.me(tokensResponse.accessToken);

        // Stocker l'utilisateur
        await storeUserInCookies(user);

        const sessionResult: SessionResult = {
            isAuthenticated: true,
            user,
            accessToken: tokensResponse.accessToken,
        };

        return ServiceResult.success(sessionResult);
    } catch (error) {
        console.error("Échec du refresh token:", error);

        // Nettoyer les cookies invalides
        await clearAuthCookies();

        const sessionResult: SessionResult = {
            isAuthenticated: false,
            error: "Session expirée",
            requiresLogin: true,
        };

        return ServiceResult.error("Échec du refresh token");
    }
}
