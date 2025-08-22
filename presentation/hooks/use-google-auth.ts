"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { googleSignInActionWithData } from "@/core/actions/auth/google-sign-in.action";
import { env } from "@/env.mjs";
import { toCamelCaseRecursive } from "@/shared/utils";
import {
    GoogleAuthCancelledError,
    GoogleAuthError,
    GoogleAuthPopupBlockedError,
    GoogleAuthTimeoutError,
} from "@/src/entities/errors/auth";
import { Token } from "@/src/entities/models/token";
import { User } from "@/src/entities/models/user";

type GoogleAuthResponse = Token & {
    user: User;
};

interface UseGoogleAuthReturn {
    signInWithGoogle: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export function useGoogleAuth(): UseGoogleAuthReturn {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signInWithGoogle = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Ouvrir la popup pour l'authentification Google (centrée)
            const width = 500;
            const height = 600;
            const dualScreenLeft =
                (window as any).screenLeft ?? window.screenX ?? 0;
            const dualScreenTop =
                (window as any).screenTop ?? window.screenY ?? 0;
            const screenWidth =
                window.innerWidth ??
                document.documentElement.clientWidth ??
                screen.width;
            const screenHeight =
                window.innerHeight ??
                document.documentElement.clientHeight ??
                screen.height;
            const left = Math.max(
                0,
                dualScreenLeft + (screenWidth - width) / 2
            );
            const top = Math.max(
                0,
                dualScreenTop + (screenHeight - height) / 2
            );

            const features = `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`;

            // Base API (backend) depuis l'env côté client
            const apiBase = env.NEXT_PUBLIC_API_BASE_URL;

            const popup = window.open(
                `${apiBase}/api/v1/auth/google`,
                "google-auth",
                features
            );

            if (!popup) {
                throw new GoogleAuthPopupBlockedError();
            }

            // Attendre que la popup se ferme ou que l'authentification soit terminée
            const authData = await new Promise<GoogleAuthResponse>(
                (resolve, reject) => {
                    const checkClosed = setInterval(() => {
                        if (popup.closed) {
                            clearInterval(checkClosed);
                            reject(new GoogleAuthCancelledError());
                        }
                    }, 1000);

                    // Écouter les messages de la popup
                    const messageHandler = (event: MessageEvent) => {
                        // Vérifier l'origine pour la sécurité
                        try {
                            const apiOrigin = new URL(
                                env.NEXT_PUBLIC_API_BASE_URL
                            ).origin;
                            if (
                                event.origin !== window.location.origin &&
                                event.origin !== apiOrigin
                            ) {
                                return;
                            }
                        } catch (_) {
                            // Si NEXT_PUBLIC_API_BASE_URL est invalide, on ne valide que l'origine courante
                            if (event.origin !== window.location.origin) return;
                        }

                        if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
                            clearInterval(checkClosed);
                            window.removeEventListener(
                                "message",
                                messageHandler
                            );
                            popup.close();
                            resolve(event.data.payload);
                        } else if (event.data.type === "GOOGLE_AUTH_ERROR") {
                            clearInterval(checkClosed);
                            window.removeEventListener(
                                "message",
                                messageHandler
                            );
                            popup.close();
                            reject(
                                new GoogleAuthError(
                                    event.data.error ||
                                        "Erreur d'authentification Google"
                                )
                            );
                        }
                    };

                    window.addEventListener("message", messageHandler);

                    // Nettoyer après 5 minutes
                    setTimeout(
                        () => {
                            clearInterval(checkClosed);
                            window.removeEventListener(
                                "message",
                                messageHandler
                            );
                            if (!popup.closed) {
                                popup.close();
                            }
                            reject(new GoogleAuthTimeoutError());
                        },
                        5 * 60 * 1000
                    );
                }
            );

            // Traiter les données d'authentification avec le server action
            const redirectTo = searchParams.get("redirectTo");

            const result = await googleSignInActionWithData({
                ...authData,
                redirectTo: redirectTo || undefined,
            });

            if (!result.success) {
                throw new GoogleAuthError(
                    result.error ||
                        "Erreur lors du traitement de l'authentification Google"
                );
            }

            // Naviguer vers la destination après création des cookies
            const target = result.redirectTo;
            if (target) {
                router.replace(target);
            } else {
                router.replace("/");
            }
        } catch (authError) {
            console.error("Erreur d'authentification Google:", authError);
            if (
                authError instanceof Error &&
                authError.message === "NEXT_REDIRECT"
            ) {
                setError(null);
                return;
            }
            setError(
                authError instanceof Error
                    ? authError.message
                    : "Une erreur est survenue lors de l'authentification Google"
            );
        } finally {
            setIsLoading(false);
        }
    }, [router, searchParams]);

    return {
        signInWithGoogle,
        isLoading,
        error,
    };
}
