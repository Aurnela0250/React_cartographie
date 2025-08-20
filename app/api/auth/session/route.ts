import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getInjection } from "@/di/container";
import { env } from "@/env.mjs";
import { Cookie } from "@/src/entities/models/cookie";
import { UserSchema } from "@/src/entities/models/user";

/**
 * Endpoint /api/auth/session pour la validation et le refresh automatique des tokens
 *
 * Workflow:
 * 1. Vérifie si accessToken et refreshToken existent
 * 2. Si accessToken manque, tente un refresh avec refreshToken
 * 3. Met à jour les cookies avec les nouveaux tokens
 * 4. Ne retourne rien (204 No Content)
 */
export async function GET(_: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        // Si aucun refreshToken, nettoyer les cookies
        if (!refreshToken) {
            await clearAuthCookies(cookieStore);
            return new NextResponse(null, { status: 204 });
        }

        // Si accessToken manque, tenter le refresh
        if (!accessToken) {
            try {
                const refreshResult = await refreshTokens(refreshToken);

                console.log("Refresh result:", refreshResult);
                await updateTokenCookies(refreshResult, cookieStore);
            } catch (error) {
                // Refresh échoué, nettoyer les cookies
                await clearAuthCookies(cookieStore);
            }
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Session API: Erreur lors de la validation:", error);
        return new NextResponse(null, { status: 204 });
    }
}

/**
 * Refresh les tokens en utilisant le controller
 */
async function refreshTokens(refreshToken: string) {
    const refreshTokenController = getInjection("IRefreshTokenController");
    return await refreshTokenController(refreshToken);
}

/**
 * Met à jour les cookies avec les nouveaux tokens
 */
async function updateTokenCookies(
    tokenData: {
        accessTokenCookie: Cookie;
        refreshTokenCookie: Cookie;
        userCookie: Cookie;
    },
    cookieStore: ReadonlyRequestCookies
) {
    // Définir le cookie d'access token
    cookieStore.set(
        tokenData.accessTokenCookie.name,
        tokenData.accessTokenCookie.value,
        {
            secure:
                tokenData.accessTokenCookie.attributes.secure ??
                env.NODE_ENV === "production",
            path: tokenData.accessTokenCookie.attributes.path ?? "/",
            domain: tokenData.accessTokenCookie.attributes.domain,
            sameSite:
                tokenData.accessTokenCookie.attributes.sameSite ?? "strict",
            httpOnly: tokenData.accessTokenCookie.attributes.httpOnly ?? true,
            maxAge: tokenData.accessTokenCookie.attributes.maxAge,
            expires: tokenData.accessTokenCookie.attributes.expires,
        }
    );

    // Définir le cookie de refresh token
    cookieStore.set(
        tokenData.refreshTokenCookie.name,
        tokenData.refreshTokenCookie.value,
        {
            secure: tokenData.refreshTokenCookie.attributes.secure ?? false,
            path: tokenData.refreshTokenCookie.attributes.path ?? "/",
            domain: tokenData.refreshTokenCookie.attributes.domain,
            sameSite:
                tokenData.refreshTokenCookie.attributes.sameSite ?? "strict",
            httpOnly: tokenData.refreshTokenCookie.attributes.httpOnly ?? true,
            maxAge: tokenData.refreshTokenCookie.attributes.maxAge,
            expires: tokenData.refreshTokenCookie.attributes.expires,
        }
    );

    // Définir le cookie utilisateur
    cookieStore.set(tokenData.userCookie.name, tokenData.userCookie.value, {
        secure: tokenData.userCookie.attributes.secure ?? false,
        path: tokenData.userCookie.attributes.path ?? "/",
        domain: tokenData.userCookie.attributes.domain,
        sameSite: tokenData.userCookie.attributes.sameSite ?? "strict",
        httpOnly: tokenData.userCookie.attributes.httpOnly ?? true,
        maxAge: tokenData.userCookie.attributes.maxAge,
        expires: tokenData.userCookie.attributes.expires,
    });
}

/**
 * Nettoie tous les cookies d'authentification
 */
async function clearAuthCookies(cookieStore: ReadonlyRequestCookies) {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("user");
}
