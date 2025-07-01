import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

import { AuthDjangoApiRepository } from "@/infrastructure/repositories/auth.repository";
import { UnauthorizedError } from "@/shared/utils/app-errors";

const authRepository = new AuthDjangoApiRepository();

interface JWTPayload {
    exp: number;
    iat: number;
    user_id?: string;
    userId?: string;
}

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) {
            console.log(
                "Refresh: Pas de refresh token, redirection vers login"
            );
            const loginUrl = new URL("/login", request.url);
            const originalUrl =
                request.nextUrl.searchParams.get("redirectTo") || request.url;
            loginUrl.searchParams.set("redirectTo", originalUrl);
            return NextResponse.redirect(loginUrl);
        }

        // Vérifier si le refresh token est encore valide
        try {
            const decodedRefreshToken = jwtDecode<JWTPayload>(refreshToken);
            const currentTime = Math.floor(
                Date.UTC(
                    new Date().getUTCFullYear(),
                    new Date().getUTCMonth(),
                    new Date().getUTCDate(),
                    new Date().getUTCHours(),
                    new Date().getUTCMinutes(),
                    new Date().getUTCSeconds()
                ) / 1000
            );

            if (decodedRefreshToken.exp <= currentTime) {
                console.log(
                    "Refresh: Refresh token expiré, redirection vers login"
                );
                // Nettoyer les cookies expirés
                cookieStore.delete("accessToken");
                cookieStore.delete("refreshToken");
                cookieStore.delete("user");
                cookieStore.delete("tokenMeta");

                const loginUrl = new URL("/login", request.url);
                const originalUrl =
                    request.nextUrl.searchParams.get("redirectTo") ||
                    request.url;
                loginUrl.searchParams.set("redirectTo", originalUrl);
                return NextResponse.redirect(loginUrl);
            }
        } catch (error) {
            console.error(
                "Refresh: Erreur lors du décodage du refresh token:",
                error
            );

            const loginUrl = new URL("/login", request.url);
            const originalUrl =
                request.nextUrl.searchParams.get("redirectTo") || request.url;
            loginUrl.searchParams.set("redirectTo", originalUrl);
            return NextResponse.redirect(loginUrl);
        }

        // Appeler l'API pour rafraîchir le token
        const newTokenData = await authRepository.refresh(refreshToken);

        // Vérifier que les nouvelles données de token sont complètes
        if (
            !newTokenData ||
            !newTokenData.accessToken ||
            !newTokenData.refreshToken ||
            !newTokenData.exp
        ) {
            console.error(
                "Refresh: Données de token incomplètes après refresh"
            );

            const loginUrl = new URL("/login", request.url);
            const originalUrl =
                request.nextUrl.searchParams.get("redirectTo") || request.url;
            loginUrl.searchParams.set("redirectTo", originalUrl);
            return NextResponse.redirect(loginUrl);
        }

        // Calculer la durée jusqu'à l'expiration
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

        // Mettre à jour les tokens dans les cookies
        cookieStore.set("accessToken", newTokenData.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: getTimeUntilExpiry(newTokenData.exp),
            path: "/",
        });

        cookieStore.set("refreshToken", newTokenData.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60, // 7 jours
            path: "/",
        });

        // Mettre à jour les métadonnées du token
        cookieStore.set(
            "tokenMeta",
            JSON.stringify({
                exp: newTokenData.exp,
                iat: newTokenData.iat,
                userId: newTokenData.userId,
            }),
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: getTimeUntilExpiry(newTokenData.exp),
                path: "/",
            }
        );

        // Récupérer l'URL de redirection depuis les paramètres ou utiliser une URL par défaut
        const redirectTo =
            request.nextUrl.searchParams.get("redirectTo") || "/dashboard";

        console.log(
            "Refresh: Token rafraîchi avec succès, redirection vers:",
            redirectTo
        );

        return NextResponse.redirect(new URL(redirectTo, request.url));
    } catch (error) {
        console.error(
            "Refresh: Erreur lors du rafraîchissement du token:",
            error
        );

        // Nettoyer les cookies en cas d'erreur
        const cookieStore = await cookies();

        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
        cookieStore.delete("user");
        cookieStore.delete("tokenMeta");

        // Gérer les erreurs spécifiques
        if (error instanceof UnauthorizedError) {
            console.log(
                "Refresh: Token de rafraîchissement invalide, redirection vers login"
            );

            const loginUrl = new URL("/login", request.url);
            const originalUrl =
                request.nextUrl.searchParams.get("redirectTo") || request.url;
            loginUrl.searchParams.set("redirectTo", originalUrl);
            return NextResponse.redirect(loginUrl);
        }

        const loginUrl = new URL("/login", request.url);
        const originalUrl =
            request.nextUrl.searchParams.get("redirectTo") || request.url;
        loginUrl.searchParams.set("redirectTo", originalUrl);
        return NextResponse.redirect(loginUrl);
    }
}
