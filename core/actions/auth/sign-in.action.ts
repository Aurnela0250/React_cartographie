"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DEFAULT_LOGIN_REDIRECT } from "@/core/constants/route";
import { getInjection } from "@/di/container";
import { loginSchema } from "@/presentation/schemas/auth.schema";
import { UnauthenticatedError } from "@/src/entities/errors/auth";

export async function signInAction(formData: FormData) {
    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const redirectTo = formData.get("redirectTo") as string;

        // Validation des données d'entrée
        const validationResult = loginSchema.safeParse({ email, password });

        if (!validationResult.success) {
            return {
                error: "Email ou mot de passe incorrect",
            };
        }

        // Utiliser l'injection de dépendance pour obtenir le contrôleur
        const signInController = getInjection("ISignInController");

        // Exécuter la logique de connexion
        const result = await signInController({ email, password });

        // Définir les cookies avec les tokens
        const cookieStore = await cookies();

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

        // Redirection après connexion réussie
        const redirectPath = redirectTo || DEFAULT_LOGIN_REDIRECT;
        redirect(redirectPath);
    } catch (error) {
        // Ignorer l'erreur NEXT_REDIRECT qui est normale
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error; // Re-lancer pour que Next.js gère la redirection
        }

        // Gérer les erreurs spécifiques
        if (error instanceof UnauthenticatedError) {
            return {
                error: "Email ou mot de passe incorrect",
            };
        }

        return {
            error: "Une erreur est survenue lors de la connexion",
        };
    }
}

export async function signInActionWithData(data: {
    email: string;
    password: string;
    redirectTo?: string;
}) {
    try {
        // Validation des données d'entrée
        const validationResult = loginSchema.safeParse(data);

        if (!validationResult.success) {
            return {
                success: false,
                error: "Données invalides",
                details: validationResult.error.errors,
            };
        }

        // Utiliser l'injection de dépendance pour obtenir le contrôleur
        const signInController = getInjection("ISignInController");

        // Exécuter la logique de connexion
        const result = await signInController({
            email: data.email,
            password: data.password,
        });

        // Définir les cookies avec les tokens
        const cookieStore = await cookies();

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

        return {
            success: true,
            redirectTo: data.redirectTo || "/",
        };
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);

        // Gérer les erreurs spécifiques
        if (error instanceof UnauthenticatedError) {
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
}
