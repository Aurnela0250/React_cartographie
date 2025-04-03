"use client";

import { useCallback } from "react";
import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";

import { AuthResult, LoginCredentials } from "@/shared/types/auth.types";

/**
 * Custom hook for authentication operations
 * @returns Authentication utilities and state
 */
export const useAuth = () => {
    const { data: session, status } = useSession();

    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated";

    /**
     * Login function
     * @param credentials - User credentials
     * @param callbackUrl - URL to redirect after login
     * @returns Sign in result
     */
    const login = useCallback(
        async (
            credentials: LoginCredentials,
            callbackUrl?: string
        ): Promise<AuthResult> => {
            try {
                const result = await signIn("credentials", {
                    ...credentials,
                    redirect: false,
                    callbackUrl: callbackUrl || "/dashboard",
                });

                if (result?.error) {
                    return { error: result.error };
                }

                return { success: true };
            } catch (error) {
                console.error("Login error:", error);

                return { error: "An unexpected error occurred" };
            }
        },
        []
    );

    /**
     * Logout function
     * @param callbackUrl - URL to redirect after logout
     */
    const logout = useCallback(async (callbackUrl?: string): Promise<void> => {
        try {
            await signOut({
                redirect: true,
                callbackUrl: callbackUrl || "/login",
            });
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    }, []);

    return {
        session: session as Session & {
            user: {
                id: string;
                name: string;
                email: string;
                role?: string;
            };
            accessToken: string;
            refreshToken: string;
        },
        user: session?.user,
        accessToken: session?.accessToken as string | undefined,
        isLoading,
        isAuthenticated,
        login,
        logout,
    };
};

export default useAuth;
