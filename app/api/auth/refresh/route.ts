import { NextRequest, NextResponse } from "next/server";

import { AuthTokenService } from "@/infrastructure/services/auth-token.service";

export async function GET(request: NextRequest) {
    const isAjaxRefresh = request.headers.get("x-refresh-request") === "true";

    try {
        console.log("Refresh: Tentative de rafraîchissement du token");

        // Utiliser le service centralisé pour vérifier l'authentification
        // Le service gère automatiquement le refresh si nécessaire
        const authService = AuthTokenService.getInstance();
        const authResult = await authService.isAuthenticated();

        if (!authResult.authenticated) {
            console.log(
                "Refresh: Échec du rafraîchissement, redirection vers login"
            );

            if (isAjaxRefresh) {
                return NextResponse.json(
                    {
                        success: false,
                        reason: authResult.requiresLogin
                            ? "session-expired"
                            : "refresh-failed",
                    },
                    { status: 401 }
                );
            }

            // Rediriger vers la page de login
            const loginUrl = new URL("/sign-in", request.url);
            const originalUrl =
                request.nextUrl.searchParams.get("redirectTo") || request.url;

            loginUrl.searchParams.set("redirectTo", originalUrl);
            loginUrl.searchParams.set("toast", "session-expired");

            return NextResponse.redirect(loginUrl);
        }

        console.log("Refresh: Token rafraîchi avec succès");

        if (isAjaxRefresh) {
            return NextResponse.json({
                success: true,
                user: authResult.user
                    ? {
                          id: authResult.user.id,
                          email: authResult.user.email,
                          active: authResult.user.active,
                          isAdmin: authResult.user.isAdmin,
                      }
                    : undefined,
            });
        }

        // Récupérer l'URL de redirection depuis les paramètres ou utiliser une URL par défaut
        const redirectTo =
            request.nextUrl.searchParams.get("redirectTo") || "/dashboard";

        console.log("Refresh: Redirection vers:", redirectTo);
        return NextResponse.redirect(new URL(redirectTo, request.url));
    } catch (error) {
        console.error("Refresh: Erreur lors du rafraîchissement:", error);

        // En cas d'erreur, nettoyer les cookies et rediriger vers login
        try {
            const authService = AuthTokenService.getInstance();
            await authService.clearTokens();
        } catch (clearError) {
            console.error(
                "Refresh: Erreur lors du nettoyage des cookies:",
                clearError
            );
        }

        if (isAjaxRefresh) {
            return NextResponse.json(
                { success: false, reason: "error" },
                { status: 401 }
            );
        }

        const loginUrl = new URL("/sign-in", request.url);
        const originalUrl =
            request.nextUrl.searchParams.get("redirectTo") || request.url;

        loginUrl.searchParams.set("redirectTo", originalUrl);
        loginUrl.searchParams.set("toast", "session-expired");

        return NextResponse.redirect(loginUrl);
    }
}
