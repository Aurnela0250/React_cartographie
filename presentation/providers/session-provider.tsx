"use client";

import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

import { User } from "@/core/entities/users.entity";
import {
    clientSessionService,
    SessionData,
} from "@/infrastructure/services/client-session.service";

interface SessionContextType {
    session: SessionData | null;
    isLoading: boolean;
    isLoggedIn: boolean;
    user: User | null;
    isExpired: boolean;
    refreshSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
    children: ReactNode;
}

/**
 * Provider pour gérer la session utilisateur côté client
 * Utilise les cookies accessibles pour récupérer les données sans appel réseau
 */
export function SessionProvider({ children }: SessionProviderProps) {
    const [session, setSession] = useState<SessionData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fonction pour rafraîchir la session
    const refreshSession = () => {
        const newSession = clientSessionService.getSessionData();

        setSession(newSession);
    };

    // Initialiser la session au montage
    useEffect(() => {
        // Récupérer la session initiale
        console.log("SessionProvider: Initializing session...");
        refreshSession();
        setIsLoading(false);
        console.log("SessionProvider: Loading set to false");

        // Surveiller les changements de session
        const unwatch = clientSessionService.watchSession((newSession) => {
            console.log("SessionProvider: Session mise à jour", newSession);
            setSession(newSession);
        });

        // Nettoyage
        return unwatch;
    }, []);

    // Valeurs dérivées
    const isLoggedIn = session?.isLoggedIn ?? false;
    const isExpired = session?.isExpired ?? false;
    const user = session ? clientSessionService.toUserEntity(session) : null;

    const contextValue: SessionContextType = {
        session,
        isLoading,
        isLoggedIn,
        user,
        isExpired,
        refreshSession,
    };

    return (
        <SessionContext.Provider value={contextValue}>
            {children}
        </SessionContext.Provider>
    );
}

/**
 * Hook pour utiliser le context de session
 * Remplace le hook useSession existant
 */
export function useSessionContext(): SessionContextType {
    const context = useContext(SessionContext);

    if (context === undefined) {
        throw new Error(
            "useSessionContext must be used within a SessionProvider"
        );
    }

    return context;
}

// Backward compatibility - garder l'ancien nom
export const AuthProvider = SessionProvider;
