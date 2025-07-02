import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

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

    const isApiRoute = path.startsWith("/api/");

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

    console.log("Middleware: Vérification des tokens pour", path);

    // Vérifier la présence des tokens
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // Si pas de refreshToken = session complètement expirée
    if (!refreshToken) {
        console.log("Middleware: Pas de refreshToken");

        if (isApiRoute) {
            // Pour les routes API, retourner 401 JSON
            return NextResponse.json(
                { error: "Non authentifié - session expirée" },
                { status: 401 }
            );
        } else {
            // Pour les routes de page, rediriger vers login
            console.log("Middleware: Redirection vers /login");
            const loginUrl = new URL("/login", request.url);

            loginUrl.searchParams.set("redirectTo", request.url);
            loginUrl.searchParams.set("toast", "session-expired");

            return NextResponse.redirect(loginUrl);
        }
    }

    // Si pas d'accessToken mais refreshToken présent = besoin de refresh
    if (!accessToken) {
        console.log("Middleware: Pas d'accessToken, tentative de refresh");

        if (isApiRoute) {
            // Pour les routes API, retourner 401 avec indication de refresh needed
            return NextResponse.json(
                { error: "Token expiré", refreshNeeded: true },
                { status: 401 }
            );
        } else {
            // Pour les routes de page, rediriger vers refresh
            const refreshUrl = new URL("/api/auth/refresh", request.url);

            refreshUrl.searchParams.set("redirectTo", request.url);

            return NextResponse.redirect(refreshUrl);
        }
    }

    try {
        // Décoder le token pour vérifier l'expiration
        const decodedToken = jwtDecode(accessToken) as { exp: number };
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = decodedToken.exp - currentTime;

        console.log(
            "Middleware: Token expire dans",
            timeUntilExpiry,
            "secondes"
        );

        // Token valide, continuer
        console.log("Middleware: Token valide, accès autorisé");

        return NextResponse.next();
    } catch (error) {
        // Erreur lors du décodage = token corrompu
        console.error(
            "Middleware: Erreur lors de la vérification du token:",
            error
        );

        if (isApiRoute) {
            // Pour les routes API, retourner 401 JSON
            return NextResponse.json(
                { error: "Token invalide", refreshNeeded: true },
                { status: 401 }
            );
        } else {
            // Pour les routes de page, essayer de refresh
            console.log("Middleware: Token corrompu, tentative de refresh");
            const refreshUrl = new URL("/api/auth/refresh", request.url);

            refreshUrl.searchParams.set("redirectTo", request.url);

            return NextResponse.redirect(refreshUrl);
        }
    }
}

export const config = {
    matcher: [
        /*
         * Appliquer le middleware à toutes les routes sauf:
         * - fichiers statiques (_next/static, images, favicon)
         * - routes publiques et API auth (gérées dans le code)
         */
        "/((?!_next/static|_next/image|favicon.ico|public|.*\\.).*)",
    ],
};
