"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { User, UserSchema } from "@/src/entities/models/user";

import { DEFAULT_LOGOUT_REDIRECT } from "../constants/route";

interface UseCurrentUserOptions {
    redirectIfNotFound?: boolean;
}

interface UseCurrentUserReturn {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

/**
 * Hook client-side pour récupérer l'utilisateur courant depuis les cookies
 * Équivalent client de getCurrentUser pour les composants client
 */
export function useCurrentUser(options: {
    redirectIfNotFound: true;
}): Omit<UseCurrentUserReturn, "user"> & { user: User };
export function useCurrentUser(
    options?: UseCurrentUserOptions
): UseCurrentUserReturn;
export function useCurrentUser({
    redirectIfNotFound = false,
} = {}): UseCurrentUserReturn {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const getCurrentUserFromCookie = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Lire le cookie userSession côté client (httpOnly: false)
                const userCookie = getCookie("user");

                if (!userCookie) {
                    if (redirectIfNotFound) {
                        router.push(DEFAULT_LOGOUT_REDIRECT);
                        return;
                    }
                    setUser(null);
                    return;
                }
                // Parser et valider les données utilisateur
                const userData = JSON.parse(userCookie);
                const validatedUser = await UserSchema.parseAsync(userData);

                setUser(validatedUser);
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Erreur lors de la récupération de l'utilisateur";
                setError(errorMessage);

                if (redirectIfNotFound) {
                    router.push(DEFAULT_LOGOUT_REDIRECT);
                } else {
                    setUser(null);
                }
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        getCurrentUserFromCookie();
    }, [redirectIfNotFound, router]);

    return { user, isLoading, error } as UseCurrentUserReturn;
}

/**
 * Fonction utilitaire pour lire un cookie côté client
 */
function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(";").shift();
        return cookieValue ? decodeURIComponent(cookieValue) : null;
    }

    return null;
}
