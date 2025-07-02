import { cookies } from "next/headers";

interface User {
    id: number;
    email: string;
    active: boolean;
    isAdmin: boolean;
}

interface TokenMeta {
    exp: number;
    iat: number;
    userId: string;
}

/**
 * Récupère l'utilisateur actuel depuis les cookies
 */
export async function getCurrentUser(): Promise<User | null> {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("user")?.value;

        if (!userCookie) {
            return null;
        }

        const user = JSON.parse(userCookie) as User;

        // Vérifier que le token n'est pas expiré
        const isTokenValid = await isTokenStillValid();

        if (!isTokenValid) {
            return null;
        }

        return user;
    } catch (error) {
        console.error(
            "Erreur lors de la récupération de l'utilisateur:",
            error
        );

        return null;
    }
}

/**
 * Vérifie si l'utilisateur est authentifié
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser();

    return user !== null && user.active;
}

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 */
export async function hasRole(role: "admin" | "user"): Promise<boolean> {
    const user = await getCurrentUser();

    if (!user) {
        return false;
    }

    if (role === "admin") {
        return user.isAdmin;
    }

    // Pour le rôle 'user', tout utilisateur actif est valide
    return user.active;
}

/**
 * Vérifie si le token est encore valide
 */
export async function isTokenStillValid(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const tokenMetaCookie = cookieStore.get("tokenMeta")?.value;

        if (!tokenMetaCookie) {
            return false;
        }

        const tokenMeta = JSON.parse(tokenMetaCookie) as TokenMeta;
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

        return tokenMeta.exp > currentTime;
    } catch (error) {
        console.error("Erreur lors de la vérification du token:", error);

        return false;
    }
}

/**
 * Récupère les tokens d'authentification
 */
export async function getAuthTokens(): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
}> {
    try {
        const cookieStore = await cookies();

        return {
            accessToken: cookieStore.get("accessToken")?.value || null,
            refreshToken: cookieStore.get("refreshToken")?.value || null,
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des tokens:", error);

        return {
            accessToken: null,
            refreshToken: null,
        };
    }
}

/**
 * Récupère les métadonnées du token
 */
export async function getTokenMeta(): Promise<TokenMeta | null> {
    try {
        const cookieStore = await cookies();
        const tokenMetaCookie = cookieStore.get("tokenMeta")?.value;

        if (!tokenMetaCookie) {
            return null;
        }

        return JSON.parse(tokenMetaCookie) as TokenMeta;
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des métadonnées du token:",
            error
        );

        return null;
    }
}

/**
 * Vérifie si l'utilisateur peut accéder à une ressource spécifique
 */
export async function canAccess(
    requiredRole?: "admin" | "user"
): Promise<boolean> {
    const isAuth = await isAuthenticated();

    if (!isAuth) {
        return false;
    }

    if (!requiredRole) {
        return true;
    }

    return await hasRole(requiredRole);
}

/**
 * Nettoie tous les cookies d'authentification
 */
export async function clearAuthCookies(): Promise<void> {
    try {
        const cookieStore = await cookies();

        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
        cookieStore.delete("user");
        cookieStore.delete("tokenMeta");
    } catch (error) {
        console.error("Erreur lors du nettoyage des cookies:", error);
    }
}
