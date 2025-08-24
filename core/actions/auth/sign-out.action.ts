"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DEFAULT_LOGOUT_REDIRECT } from "@/core/constants/route";
import { getInjection } from "@/di/container";
import {
    AuthenticationError,
    UnauthenticatedError,
} from "@/src/entities/errors/auth";

export const signOutAction = async () => {
    try {
        const cookieStore = await cookies();

        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        const signOutController = getInjection("ISignOutController");

        await signOutController({
            accessToken,
            refreshToken,
        });

        // Supprimer tous les cookies d'authentification
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
        cookieStore.delete("user");
        // Nettoyer aussi les cookies session visibles côté client
        cookieStore.delete("userSession");
        cookieStore.delete("sessionStatus");

        redirect(DEFAULT_LOGOUT_REDIRECT);
    } catch (error) {
        // Même en cas d'erreur, supprimer les cookies locaux
        const cookieStore = await cookies();
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
        cookieStore.delete("user");
        // Nettoyer aussi les cookies session visibles côté client
        cookieStore.delete("userSession");
        cookieStore.delete("sessionStatus");

        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error; // Re-lancer pour que Next.js gère la redirection
        }

        if (
            error instanceof UnauthenticatedError ||
            error instanceof AuthenticationError
        ) {
            redirect(DEFAULT_LOGOUT_REDIRECT);
        }
        throw error;
    }
};
