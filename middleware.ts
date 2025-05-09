import { NextRequest, NextResponse } from "next/server";

import { AuthDjangoApiRepository } from "@/infrastructure/repositories/auth.repository";
import {
    apiAuthPrefix,
    authRoutes,
    DEFAULT_LOGIN_REDIRECT,
    publicRoutes,
} from "@/routes";
import { getRouteHandlerSession, SessionData } from "@/shared/utils/auth";

const authRepository = new AuthDjangoApiRepository();

// Fonction pour gérer le rafraîchissement des tokens
async function refreshToken(session: SessionData): Promise<boolean> {
    if (!session.token?.refreshToken) {
        console.log("Middleware: Pas de refresh token trouvé.");

        return false;
    }

    try {
        console.log("Middleware: Tentative de rafraîchissement du token...");
        const { user: _userData, ..._newTokenData } =
            await authRepository.refreshToken(session.token.refreshToken);

        if (
            !_newTokenData ||
            !_newTokenData.accessToken ||
            !_newTokenData.refreshToken ||
            !_newTokenData.exp
        ) {
            console.error(
                "Middleware: Échec du rafraîchissement - données de token incomplètes."
            );

            return false;
        }

        // Mettre à jour la session avec les nouvelles données de token
        session.token = _newTokenData;

        // Mettre à jour les infos utilisateur si présentes dans la réponse
        if (_userData) {
            session.user = _userData;
        }

        session.isLoggedIn = true;
        console.log("Middleware: Token rafraîchi avec succès.");

        return true;
    } catch (error) {
        console.error(
            "Middleware: Erreur de rafraîchissement de token:",
            error
        );

        // Vérification du type spécifique d'erreur
        if ((error as any).errorType === "TOKEN_REFRESH_EXPIRED") {
            console.log(
                "Middleware: Token de rafraîchissement expiré, redirection vers login."
            );
        }

        return false;
    }
}

export default async function middleware(request: NextRequest) {
    const { nextUrl } = request;
    const response = NextResponse.next();

    // Récupérer la session
    const session = await getRouteHandlerSession(request, response);

    const isLoggedIn = !!session.isLoggedIn;
    const token = session.token;
    const now = Math.floor(Date.now() / 1000); // Temps actuel en secondes

    let sessionModified = false;

    // Logique de rafraîchissement de token
    if (isLoggedIn && token && token.exp) {
        // Vérifier si le token est expiré ou près d'expirer (30s avant expiration)
        if (token.exp <= now + 30) {
            console.log(
                `Middleware: Token expire à ${new Date(token.exp * 1000)}, temps actuel ${new Date(now * 1000)}.`
            );
            const refreshed = await refreshToken(session);

            if (refreshed) {
                sessionModified = true;
            } else {
                // Échec de rafraîchissement - Déconnecter l'utilisateur
                console.log(
                    "Middleware: Échec de rafraîchissement, déconnexion."
                );
                session.destroy();
                sessionModified = true;

                return NextResponse.redirect(new URL("/login", nextUrl));
            }
        }
    }

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    // Autoriser les routes API d'auth
    if (isApiAuthRoute) {
        if (sessionModified) {
            await session.save();
        }

        return response;
    }

    // Rediriger les utilisateurs connectés depuis les routes d'auth
    if (isAuthRoute) {
        if (isLoggedIn) {
            if (sessionModified) {
                await session.save();
            }

            return NextResponse.redirect(
                new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)
            );
        }

        if (sessionModified) {
            await session.save();
        }

        return response;
    }

    // Protéger les routes non-publiques
    if (!isLoggedIn && !isPublicRoute) {
        console.log(
            "Middleware: Utilisateur non authentifié, redirection vers login."
        );

        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    // Sauvegarder la session si modifiée
    if (sessionModified) {
        await session.save();
    }

    return response;
}

// Garder la configuration du matcher
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
