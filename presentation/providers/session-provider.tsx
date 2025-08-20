"use client";

import { ReactNode, useCallback, useEffect } from "react";

interface SessionProviderProps {
    children: ReactNode;
    refetchInterval?: number; // en secondes, par défaut 5 minutes
}

/**
 * SessionProvider couplé à l'API /api/auth/session pour la gestion automatique des tokens
 * Actualise la session (tokens, user-info et cookies) en temps voulu
 */
export function SessionProvider({
    children,
    refetchInterval = 5 * 60, // 5 minutes par défaut
}: SessionProviderProps) {
    // Fonction pour vérifier et rafraîchir les tokens via l'API session
    const checkAndRefreshTokens = useCallback(async () => {
        try {
            const response = await fetch("/api/auth/session", {
                method: "GET",
                credentials: "include", // Important pour inclure les cookies
            });

            // L'API retourne toujours 204, pas besoin de vérifier le contenu
            console.log("SessionProvider: Vérification des tokens effectuée");
        } catch (error) {
            console.error(
                "SessionProvider: Erreur lors de la vérification des tokens:",
                error
            );
        }
    }, []);

    // Initialisation et polling pour la vérification automatique
    useEffect(() => {
        // Vérification initiale
        checkAndRefreshTokens();

        // Polling interval pour vérifier périodiquement
        let interval: NodeJS.Timeout | undefined;
        if (refetchInterval > 0) {
            interval = setInterval(
                checkAndRefreshTokens,
                refetchInterval * 1000
            );
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [checkAndRefreshTokens, refetchInterval]);

    // Event listeners pour la vérification
    useEffect(() => {
        // Vérification au focus de la fenêtre
        const handleFocus = () => {
            checkAndRefreshTokens();
        };

        // Vérification quand la page redevient visible
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                checkAndRefreshTokens();
            }
        };

        window.addEventListener("focus", handleFocus);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [checkAndRefreshTokens]);

    return <>{children}</>;
}
