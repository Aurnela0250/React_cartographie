import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

import { User } from "@/core/entities/users.entity";
import { AuthDjangoApiRepository } from "@/infrastructure/repositories/auth.repository";

interface TokenValidationResult {
    isValid: boolean;
    isExpired: boolean;
    needsRefresh: boolean;
    userId?: string;
}

interface AuthenticationResult {
    authenticated: boolean;
    accessToken: string | null;
    user?: User;
    error?: string;
    requiresLogin?: boolean;
}

interface LoginResult {
    success: boolean;
    user?: User;
    error?: string;
}

interface TokenPair {
    accessToken: string | null;
    refreshToken: string | null;
}

interface TokenMeta {
    exp: number;
    iat: number;
    userId: number;
}

interface JWTPayload {
    exp: number;
    iat?: number;
    userId?: string;
}

/**
 * Service centralisé pour la gestion complète de l'authentification
 * Implémente le workflow : validation locale → validation backend → refresh automatique
 * Suit les principes de Clean Architecture - Pattern Singleton
 */
export class AuthTokenService {
    private static instance: AuthTokenService | null = null;
    private authRepository: AuthDjangoApiRepository;

    private constructor() {
        this.authRepository = new AuthDjangoApiRepository();
    }

    /**
     * Récupère l'instance unique du service
     */
    public static getInstance(): AuthTokenService {
        if (!AuthTokenService.instance) {
            AuthTokenService.instance = new AuthTokenService();
        }

        return AuthTokenService.instance;
    }

    /**
     * Récupère les tokens depuis les cookies
     */
    async getTokens(): Promise<TokenPair> {
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
     * Récupère l'utilisateur depuis les cookies
     */
    async getUserFromCookies(): Promise<User | null> {
        try {
            const cookieStore = await cookies();
            const userCookie = cookieStore.get("user")?.value;

            if (!userCookie) {
                return null;
            }

            return User.fromUnknown(JSON.parse(userCookie));
        } catch (error) {
            console.error(
                "Erreur lors de la récupération de l'utilisateur:",
                error
            );

            return null;
        }
    }

    /**
     * Valide l'access token localement (pour le middleware)
     * Utilisé par le middleware pour vérifier l'accès aux pages
     */
    async validateAccessToken(): Promise<TokenValidationResult> {
        try {
            const { accessToken } = await this.getTokens();

            if (!accessToken) {
                return {
                    isValid: false,
                    isExpired: false,
                    needsRefresh: true,
                };
            }

            // Décoder le token pour vérifier l'expiration locale
            const decodedToken = jwtDecode(accessToken) as JWTPayload;
            const currentTime = Math.floor(Date.now() / 1000);
            const isExpired = decodedToken.exp <= currentTime;

            if (isExpired) {
                return {
                    isValid: false,
                    isExpired: true,
                    needsRefresh: true,
                };
            }

            return {
                isValid: true,
                isExpired: false,
                needsRefresh: false,
                userId: decodedToken.userId,
            };
        } catch (error) {
            console.error("Erreur lors de la validation du token:", error);

            return {
                isValid: false,
                isExpired: false,
                needsRefresh: true,
            };
        }
    }

    /**
     * Vérifie l'authentification complète avec validation backend
     * Workflow complet : cookies → validation locale → validation backend → refresh si nécessaire
     */
    async isAuthenticated(): Promise<AuthenticationResult> {
        try {
            const { accessToken, refreshToken } = await this.getTokens();

            // Étape 1: Vérifier la présence des tokens
            if (!refreshToken) {
                return {
                    authenticated: false,
                    accessToken: null,
                    error: "Session complètement expirée",
                    requiresLogin: true,
                };
            }

            if (!accessToken) {
                // Pas d'access token mais refresh token présent → tenter le refresh
                console.log(
                    "AuthTokenService: Access token manquant, tentative de refresh"
                );

                return await this.attemptTokenRefresh(refreshToken);
            }

            // Étape 2: Validation locale du token
            const localValidation = await this.validateAccessToken();

            if (!localValidation.isValid) {
                if (localValidation.needsRefresh) {
                    console.log(
                        "AuthTokenService: Token expiré localement, tentative de refresh"
                    );

                    return await this.attemptTokenRefresh(refreshToken);
                }

                return {
                    authenticated: false,
                    accessToken: null,
                    error: "Token invalide",
                    requiresLogin: true,
                };
            }

            // Étape 3: Validation backend (vérifier que le token est toujours valide côté serveur)
            try {
                const user = await this.authRepository.me(accessToken);

                // Stocker l'utilisateur en cookie pour éviter des appels répétés
                await this.storeUser(user);

                return {
                    authenticated: true,
                    accessToken,
                    user,
                };
            } catch (error) {
                console.log(
                    "AuthTokenService: Token invalide côté backend, tentative de refresh"
                );

                // Token invalide côté backend → tenter le refresh
                return await this.attemptTokenRefresh(refreshToken);
            }
        } catch (error) {
            console.error(
                "AuthTokenService: Erreur lors de la vérification d'authentification:",
                error
            );

            return {
                authenticated: false,
                accessToken: null,
                error: "Erreur lors de la vérification",
                requiresLogin: true,
            };
        }
    }

    /**
     * Tente de rafraîchir le token automatiquement
     */
    private async attemptTokenRefresh(
        refreshToken: string
    ): Promise<AuthenticationResult> {
        try {
            console.log("AuthTokenService: Tentative de refresh du token");

            // Appeler l'API de refresh
            const newTokenData =
                await this.authRepository.refresh(refreshToken);

            // Stocker les nouveaux tokens
            await this.setTokens(
                newTokenData.accessToken,
                newTokenData.refreshToken,
                {
                    exp: newTokenData.exp,
                    iat: newTokenData.iat,
                    userId: newTokenData.userId,
                }
            );

            // Stocker l'utilisateur
            await this.storeUser(newTokenData.user);

            console.log("AuthTokenService: Refresh token réussi");

            return {
                authenticated: true,
                accessToken: newTokenData.accessToken,
                user: newTokenData.user,
            };
        } catch (error) {
            console.error("AuthTokenService: Échec du refresh token:", error);

            // Nettoyer tous les tokens expirés
            await this.clearTokens();

            return {
                authenticated: false,
                accessToken: null,
                error: "Session expirée, reconnexion requise",
                requiresLogin: true,
            };
        }
    }

    /**
     * Effectue la connexion utilisateur
     */
    async login(email: string, password: string): Promise<LoginResult> {
        try {
            const tokenData = await this.authRepository.login({
                email,
                password,
            });

            // Stocker les tokens
            await this.setTokens(
                tokenData.accessToken,
                tokenData.refreshToken,
                {
                    exp: tokenData.exp,
                    iat: tokenData.iat,
                    userId: tokenData.userId,
                }
            );

            // Stocker l'utilisateur
            await this.storeUser(tokenData.user);

            return {
                success: true,
                user: tokenData.user,
            };
        } catch (error) {
            console.error(
                "AuthTokenService: Erreur lors de la connexion:",
                error
            );

            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Erreur de connexion",
            };
        }
    }

    /**
     * Effectue la déconnexion
     */
    async logout(): Promise<void> {
        try {
            const { accessToken, refreshToken } = await this.getTokens();

            if (accessToken && refreshToken) {
                // Appeler l'API de logout
                await this.authRepository.logout(accessToken, refreshToken);
            }
        } catch (error) {
            console.error(
                "AuthTokenService: Erreur lors de la déconnexion:",
                error
            );
        } finally {
            // Toujours nettoyer les cookies locaux
            await this.clearTokens();
        }
    }

    /**
     * Stocke l'utilisateur dans les cookies
     */
    private async storeUser(user: User): Promise<void> {
        try {
            const cookieStore = await cookies();

            // Cookie httpOnly pour la sécurité (utilisé côté serveur)
            cookieStore.set("user", JSON.stringify(user), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60, // 7 jours
                path: "/",
            });

            // Cookie accessible côté client pour l'interface utilisateur
            const userSession = {
                id: user.id,
                email: user.email,
                active: user.active,
                isAdmin: user.isAdmin,
            };

            cookieStore.set("userSession", JSON.stringify(userSession), {
                httpOnly: false, // Accessible côté client
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60, // 7 jours
                path: "/",
            });
        } catch (error) {
            console.error("Erreur lors du stockage de l'utilisateur:", error);
        }
    }

    /**
     * Nettoie tous les cookies d'authentification
     */
    async clearTokens(): Promise<void> {
        try {
            const cookieStore = await cookies();

            cookieStore.delete("accessToken");
            cookieStore.delete("refreshToken");
            cookieStore.delete("user");
            cookieStore.delete("tokenMeta");
            cookieStore.delete("userSession");
            cookieStore.delete("sessionStatus");
        } catch (error) {
            console.error("Erreur lors du nettoyage des tokens:", error);
        }
    }

    /**
     * Stocke les tokens dans les cookies
     */
    async setTokens(
        accessToken: string,
        refreshToken: string,
        tokenMeta: TokenMeta
    ): Promise<void> {
        try {
            const cookieStore = await cookies();

            // Calculer la durée jusqu'à l'expiration
            const getTimeUntilExpiry = (exp: number): number => {
                const currentTimeUTC = Math.floor(Date.now() / 1000);

                return Math.max(0, exp - currentTimeUTC);
            };

            // Stocker l'access token
            cookieStore.set("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: getTimeUntilExpiry(tokenMeta.exp),
                path: "/",
            });

            // Stocker le refresh token
            cookieStore.set("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                domain: "",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60, // 7 jours
                path: "/",
            });

            // Stocker les métadonnées (httpOnly pour sécurité)
            cookieStore.set("tokenMeta", JSON.stringify(tokenMeta), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: getTimeUntilExpiry(tokenMeta.exp),
                path: "/",
            });

            // Stocker le statut de session accessible côté client
            const sessionStatus = {
                isLoggedIn: true,
                exp: tokenMeta.exp,
                userId: tokenMeta.userId,
            };

            cookieStore.set("sessionStatus", JSON.stringify(sessionStatus), {
                httpOnly: false, // Accessible côté client
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: getTimeUntilExpiry(tokenMeta.exp),
                path: "/",
            });
        } catch (error) {
            console.error("Erreur lors du stockage des tokens:", error);
            throw error;
        }
    }
}
