"use client";

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

export interface SessionData {
    user: {
        id: number;
        email: string;
        active: boolean;
        isAdmin: boolean;
    } | null;
    expires?: string | null;
}

export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

interface SessionContextType {
    data: SessionData | null;
    status: SessionStatus;
    update: () => Promise<SessionData | null>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
    children: ReactNode;
    refetchInterval?: number; // en secondes, par défaut 5 minutes
    refetchOnWindowFocus?: boolean;
}

/**
 * SessionProvider inspiré d'Auth.js
 * Gère la synchronisation automatique de la session
 */
export function SessionProvider({
    children,
    refetchInterval = 5 * 60, // 5 minutes par défaut
    refetchOnWindowFocus = true,
}: SessionProviderProps) {
    const [data, setData] = useState<SessionData | null>(null);
    const [status, setStatus] = useState<SessionStatus>("loading");

    // Fonction pour récupérer la session depuis l'API
    const fetchSession = useCallback(async (): Promise<SessionData | null> => {
        try {
            const response = await fetch("/api/auth/session", {
                credentials: "include",
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const sessionData = await response.json();

            return sessionData;
        } catch (error) {
            console.error("useSession: Erreur lors de la récupération:", error);

            return { user: null, expires: null };
        }
    }, []);

    // Fonction update exposée au hook
    const update = useCallback(async (): Promise<SessionData | null> => {
        setStatus("loading");
        const sessionData = await fetchSession();

        setData(sessionData);
        setStatus(sessionData?.user ? "authenticated" : "unauthenticated");

        return sessionData;
    }, [fetchSession]);

    // Initialisation et polling
    useEffect(() => {
        // Récupération initiale
        update();

        // Polling interval
        if (refetchInterval > 0) {
            const interval = setInterval(update, refetchInterval * 1000);

            return () => clearInterval(interval);
        }
    }, [update, refetchInterval]);

    // Event listeners pour la synchronisation
    useEffect(() => {
        // Refresh au focus de la fenêtre
        const handleFocus = () => {
            if (refetchOnWindowFocus) {
                update();
            }
        };

        // Refresh quand la page redevient visible
        const handleVisibilityChange = () => {
            if (!document.hidden && refetchOnWindowFocus) {
                update();
            }
        };

        // Sync entre onglets via storage events
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "session-updated") {
                update();
            }
        };

        window.addEventListener("focus", handleFocus);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [update, refetchOnWindowFocus]);

    return (
        <SessionContext.Provider value={{ data, status, update }}>
            {children}
        </SessionContext.Provider>
    );
}

/**
 * Hook useSession inspiré d'Auth.js
 * Interface simple et élégante pour accéder à la session
 *
 * Usage:
 * ```tsx
 * function Component() {
 *   const { data: session, status } = useSession()
 *
 *   if (status === "loading") return <p>Loading...</p>
 *   if (status === "unauthenticated") return <p>Not logged in</p>
 *
 *   return <p>Hello {session.user.email}!</p>
 * }
 * ```
 */
export function useSession() {
    const context = useContext(SessionContext);

    if (context === undefined) {
        throw new Error("useSession doit être utilisé dans un SessionProvider");
    }

    return context;
}

/**
 * Fonction utilitaire pour déclencher un refresh de session
 * Utile après login/logout pour synchroniser immédiatement
 */
export function triggerSessionUpdate() {
    // Notify via localStorage pour sync entre onglets
    localStorage.setItem("session-updated", Date.now().toString());
    localStorage.removeItem("session-updated");
}
