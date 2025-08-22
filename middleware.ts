import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/core/auth/get-current-user";
import { authRoutes, DEFAULT_LOGIN_REDIRECT } from "@/core/constants/route";

export default async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    console.log("Middleware: Vérification de la route", path);

    // Ignorer les requêtes qui commencent par des 'api/' - elles ont leur propre système de protection
    if (path.startsWith("/api/")) {
        return NextResponse.next();
    }

    // Ignorer les fichiers statiques
    if (
        path.startsWith("/_next") ||
        path.startsWith("/favicon.ico") ||
        path.startsWith("/public") ||
        path.includes(".")
    ) {
        return NextResponse.next();
    }

    // Vérifier si l'utilisateur est connecté
    const user = await getCurrentUser();
    const isAuthenticated = !!user;
    const isAuthRoute = authRoutes.includes(path);

    // Si l'utilisateur est connecté et essaie d'accéder aux routes auth
    if (isAuthenticated && isAuthRoute) {
        console.log(
            "Middleware: Utilisateur connecté, redirection depuis route auth"
        );
        return NextResponse.redirect(
            new URL(DEFAULT_LOGIN_REDIRECT, request.url)
        );
    }

    // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
    if (!isAuthenticated && !isAuthRoute) {
        console.log(
            "Middleware: Utilisateur non connecté, redirection vers sign-in"
        );

        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("redirectTo", request.url);

        return NextResponse.redirect(signInUrl);
    }

    // Vérifier les routes admin si l'utilisateur est connecté
    if (isAuthenticated && path.startsWith("/admin")) {
        if (!user?.isAdmin) {
            console.log(
                "Middleware: Accès admin refusé - utilisateur non admin"
            );
            return NextResponse.redirect(
                new URL(DEFAULT_LOGIN_REDIRECT, request.url)
            );
        }
    }

    console.log("Middleware: Accès autorisé");
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
