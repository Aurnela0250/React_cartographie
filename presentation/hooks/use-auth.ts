"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: number;
    email: string;
    active: boolean;
    isAdmin: boolean;
}

interface UseAuthReturn {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (
        email: string,
        password: string
    ) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Charger l'utilisateur au montage du composant
    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await fetch("/api/auth/me");

                if (response.ok) {
                    const userData = await response.json();

                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error(
                    "Erreur lors du chargement de l'utilisateur:",
                    error
                );
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    // Fonction de connexion
    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!result.success || !response.ok) {
                return {
                    success: false,
                    error:
                        result.error ||
                        "Une erreur est survenue lors de la connexion",
                };
            }

            // Mettre à jour l'état utilisateur
            setUser(result.user);

            return { success: true };
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);

            return {
                success: false,
                error: "Une erreur est survenue lors de la connexion",
            };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fonction de déconnexion
    const logout = useCallback(async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
            });
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        } finally {
            // Nettoyer l'état local
            setUser(null);

            // Rediriger vers la page de connexion
            router.push("/sign-in");
            router.refresh();
        }
    }, [router]);

    // Fonction pour rafraîchir les données utilisateur
    const refreshUser = useCallback(async () => {
        try {
            const response = await fetch("/api/auth/me");

            if (response.ok) {
                const userData = await response.json();

                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error(
                "Erreur lors du rafraîchissement des données utilisateur:",
                error
            );
            setUser(null);
        }
    }, []);

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
    };
}
