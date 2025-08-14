import { User } from "@/core/entities/users.entity";

interface UserSessionData {
    id: number;
    email: string;
    active: boolean;
    isAdmin: boolean;
}

interface SessionStatusData {
    isLoggedIn: boolean;
    exp: number;
    userId: number;
}

interface SessionData {
    isLoggedIn: boolean;
    user: UserSessionData | null;
    isExpired: boolean;
}

/**
 * Service client pour récupérer les données de session depuis les cookies accessibles
 * Fonctionne uniquement côté client (browser) - Option C : Hybride
 */
export class ClientSessionService {
    private static instance: ClientSessionService | null = null;

    private constructor() {}

    /**
     * Récupère l'instance unique du service
     */
    public static getInstance(): ClientSessionService {
        if (!ClientSessionService.instance) {
            ClientSessionService.instance = new ClientSessionService();
        }

        return ClientSessionService.instance;
    }

    /**
     * Récupère la valeur d'un cookie côté client
     */
    private getCookie(name: string): string | null {
        if (typeof document === "undefined") return null;

        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) {
            const cookieValue = parts.pop()?.split(";").shift();

            return cookieValue ? decodeURIComponent(cookieValue) : null;
        }

        return null;
    }

    /**
     * Vérifie si la session est expirée
     */
    private isSessionExpired(sessionStatus: SessionStatusData): boolean {
        try {
            const currentTime = Math.floor(Date.now() / 1000);

            return sessionStatus.exp <= currentTime;
        } catch {
            return true;
        }
    }

    /**
     * Récupère les données de session depuis les cookies
     * Cette méthode ne fait aucun appel réseau
     */
    getSessionData(): SessionData {
        try {
            // Vérifier si on est côté client
            if (typeof document === "undefined") {
                return {
                    isLoggedIn: false,
                    user: null,
                    isExpired: false,
                };
            }

            // Récupérer les cookies accessibles
            const sessionStatusCookie = this.getCookie("sessionStatus");
            const userSessionCookie = this.getCookie("userSession");

            // Si pas de statut de session mais qu'on a les données utilisateur, on considère connecté
            if (!sessionStatusCookie) {
                if (userSessionCookie) {
                    try {
                        const userData = JSON.parse(userSessionCookie);

                        return {
                            isLoggedIn: true,
                            user: userData,
                            isExpired: false,
                        };
                    } catch {
                        // Erreur de parsing, pas connecté
                    }
                }

                return {
                    isLoggedIn: false,
                    user: null,
                    isExpired: false,
                };
            }

            // Parser le statut de session
            let sessionStatus: SessionStatusData;

            try {
                sessionStatus = JSON.parse(sessionStatusCookie);
            } catch {
                return {
                    isLoggedIn: false,
                    user: null,
                    isExpired: false,
                };
            }

            // Vérifier si la session est expirée
            const isExpired = this.isSessionExpired(sessionStatus);

            if (isExpired) {
                return {
                    isLoggedIn: false,
                    user: null,
                    isExpired: true,
                };
            }

            // Récupérer les données utilisateur
            let user: UserSessionData | null = null;

            if (userSessionCookie) {
                try {
                    user = JSON.parse(userSessionCookie) as UserSessionData;
                } catch (error) {
                    console.warn(
                        "Erreur lors du parsing des données utilisateur:",
                        error
                    );
                }
            }

            return {
                isLoggedIn: sessionStatus.isLoggedIn,
                user,
                isExpired: false,
            };
        } catch (error) {
            console.error(
                "Erreur lors de la récupération de la session:",
                error
            );

            return {
                isLoggedIn: false,
                user: null,
                isExpired: false,
            };
        }
    }

    /**
     * Surveille les changements de cookies et notifie via un callback
     */
    watchSession(callback: (session: SessionData) => void): () => void {
        if (typeof document === "undefined") {
            return () => {}; // Pas de surveillance côté serveur
        }

        let lastSession = JSON.stringify(this.getSessionData());

        const checkSession = () => {
            const currentSession = JSON.stringify(this.getSessionData());

            if (currentSession !== lastSession) {
                lastSession = currentSession;
                callback(JSON.parse(currentSession));
            }
        };

        // Vérifier les changements toutes les 500ms pour une réactivité immédiate
        const interval = setInterval(checkSession, 500);

        // Écouter les changements de focus pour vérifier immédiatement
        const handleFocus = () => checkSession();
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                checkSession();
            }
        };

        // Écouter les événements de changement de cookies (navigation/fetch)
        const handleBeforeUnload = () => checkSession();

        // Vérification immédiate au démarrage
        setTimeout(checkSession, 100);

        window.addEventListener("focus", handleFocus);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("beforeunload", handleBeforeUnload);

        // Fonction de nettoyage
        return () => {
            clearInterval(interval);
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }

    /**
     * Convertit les données de session en format User complet
     */
    toUserEntity(sessionData: SessionData): User | null {
        if (!sessionData.user) return null;

        return User.fromUnknown({
            id: sessionData.user.id,
            email: sessionData.user.email,
            active: sessionData.user.active,
            isAdmin: sessionData.user.isAdmin,
            createdBy: 0, // Valeurs par défaut car non stockées côté client
            updatedBy: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    }
}

// Export de l'instance singleton
export const clientSessionService = ClientSessionService.getInstance();

// Export des types
export type { SessionData, UserSessionData };
