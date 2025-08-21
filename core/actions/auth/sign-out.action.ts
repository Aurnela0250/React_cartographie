"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

        redirect("/login");
    } catch (error) {
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error; // Re-lancer pour que Next.js gère la redirection
        }

        if (
            error instanceof UnauthenticatedError ||
            error instanceof AuthenticationError
        ) {
            redirect("/login");
        }
        throw error;
    }
};
