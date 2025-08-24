"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DEFAULT_LOGIN_REDIRECT } from "@/core/constants/route";
import { getInjection } from "@/di/container";
import { env } from "@/env.mjs";
import { GoogleAuthError } from "@/src/entities/errors/auth";
import { Token } from "@/src/entities/models/token";
import { User } from "@/src/entities/models/user";

type GoogleAuthResponse = Token & {
    user: User;
};

export async function googleSignInAction(
    data: GoogleAuthResponse,
    redirectTo?: string
) {
    try {
        const cookieStore = await cookies();

        const authService = getInjection("IAuthService");

        const result = await authService.createTokensCookie(
            data.accessToken,
            data.refreshToken,
            data.user
        );

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

        console.error("Erreur lors de la connexion Google:", error);
        throw new GoogleAuthError(
            "Une erreur est survenue lors de la connexion Google"
        );
    }
}

export async function googleSignInActionWithData(
    data: GoogleAuthResponse & { redirectTo?: string }
) {
    try {
        const cookieStore = await cookies();

        const authService = getInjection("IAuthService");

        const result = await authService.createTokensCookie(
            data.accessToken,
            data.refreshToken,
            data.user
        );

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

        return {
            success: true,
            redirectTo: data.redirectTo || DEFAULT_LOGIN_REDIRECT,
            user: data.user,
        };
    } catch (error) {
        console.error("Erreur lors de la connexion Google:", error);
        return {
            success: false,
            error: "Une erreur est survenue lors de la connexion Google",
        };
    }
}
