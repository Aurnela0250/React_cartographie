import { cookies } from "next/headers";

export interface AuthSession {
    user: {
        id: number;
        email: string;
        active: boolean;
        isAdmin: boolean;
    } | null;
    expires?: string;
}

/**
 * Fonction auth() inspirée d'Auth.js
 * Récupère la session côté serveur de manière simple et élégante
 *
 * Usage:
 * ```ts
 * import { auth } from "@/lib/auth"
 *
 * export default async function Page() {
 *   const session = await auth()
 *   return <div>User: {session?.user?.email}</div>
 * }
 * ```
 */
export async function auth(): Promise<AuthSession | null> {
    try {
        const cookieStore = await cookies();

        // Récupérer les cookies de session
        const userSessionCookie = cookieStore.get("userSession");
        const sessionStatusCookie = cookieStore.get("sessionStatus");

        // Si pas de cookie utilisateur, pas de session
        if (!userSessionCookie?.value) {
            return null;
        }

        // Parser les données utilisateur
        let userData;

        try {
            userData = JSON.parse(userSessionCookie.value);
        } catch {
            return null;
        }

        // Vérifier le statut de session si disponible
        if (sessionStatusCookie?.value) {
            try {
                const sessionStatus = JSON.parse(sessionStatusCookie.value);

                // Vérifier si la session est active
                if (!sessionStatus.isLoggedIn) {
                    return null;
                }

                // Vérifier l'expiration
                if (
                    sessionStatus.exp &&
                    Date.now() / 1000 > sessionStatus.exp
                ) {
                    return null;
                }
            } catch {
                // Si erreur de parsing du statut, utiliser seulement userSession
            }
        }

        // Construire la session au format Auth.js
        return {
            user: {
                id: userData.id,
                email: userData.email,
                active: userData.active,
                isAdmin: userData.isAdmin,
            },
            expires: sessionStatusCookie?.value
                ? JSON.parse(sessionStatusCookie.value).exp?.toString()
                : undefined,
        };
    } catch (error) {
        console.error(
            "auth(): Erreur lors de la récupération de la session:",
            error
        );

        return null;
    }
}

/**
 * Utilitaire pour vérifier si l'utilisateur est connecté
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await auth();

    return session?.user != null;
}

/**
 * Utilitaire pour récupérer l'utilisateur actuel
 */
export async function getCurrentUser(): Promise<AuthSession["user"]> {
    const session = await auth();

    return session?.user || null;
}
