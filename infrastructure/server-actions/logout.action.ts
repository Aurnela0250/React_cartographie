"use server";

import { actionClient } from "@/infrastructure/services/safe-action";
import { InternalServerError } from "@/shared/utils/app-errors";

export const logout = actionClient.action(async () => {
    try {
        const response = await fetch("/api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const error = await response.json();

            throw new Error(error.error || "Échec de la déconnexion");
        }

        const result = await response.json();

        return { success: result.success };
    } catch (error) {
        console.error("Erreur Action Logout:", error);
        throw new InternalServerError(
            "Une erreur est survenue lors de la déconnexion"
        );
    }
});
