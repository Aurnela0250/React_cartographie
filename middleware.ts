import { NextRequest, NextResponse } from "next/server";

import { AuthTokenService } from "@/infrastructure/services/auth-token.service";

// Routes qui ne nécessitent pas d'authentification
const publicPaths = ["/", "/login", "/register"];
// Endpoints d'auth qui n'ont pas besoin de token
const authApiPathsWithoutToken = [
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/refresh",
];
// Routes API publiques (qui ne nécessitent pas d'authentification)
const publicApiPaths: string[] = [
    // Ajoutez ici les routes API publiques si nécessaire
    // "/api/public/health",
];

export default async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Permettre l'accès aux routes vraiment publiques et aux API d'auth sans token
    if (
        publicPaths.some((p) => path === p || (p === "/" && path === "/")) ||
        authApiPathsWithoutToken.some((p) => path.startsWith(p)) ||
        publicApiPaths.some((p) => path.startsWith(p)) ||
        path.startsWith("/_next") ||
        path.startsWith("/favicon.ico") ||
        path.startsWith("/public")
    ) {
        return NextResponse.next();
    }

    // Le middleware ne vérifie que les routes de navigation (pas les API)
    // Les API routes gèrent leur propre authentification
    if (path.startsWith("/api/")) {
        return NextResponse.next();
    }

    // Utiliser isAuthenticated qui gère automatiquement le refresh
    const authService = AuthTokenService.getInstance();
    const authResult = await authService.isAuthenticated();

    if (!authResult.authenticated) {
        console.log(
            "Middleware: Utilisateur non authentifié, redirection vers login"
        );

        const loginUrl = new URL("/login", request.url);

        loginUrl.searchParams.set("redirectTo", request.url);
        loginUrl.searchParams.set("toast", "session-expired");

        return NextResponse.redirect(loginUrl);
    }

    console.log("Middleware: Utilisateur authentifié, accès autorisé");

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Appliquer le middleware à toutes les routes sauf:
         * - fichiers statiques (_next/static, images, favicon)
         * - routes publiques et API auth (gérées dans le code)
         */
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    ],
};
