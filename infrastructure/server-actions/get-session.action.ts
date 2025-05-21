"use server";

import { cookies } from "next/headers";
import { getIronSession, IronSession } from "session-auth";

import { SessionData, sessionOptions } from "@/shared/utils/auth";

// Fonction pour obtenir la session dans les Server Components, Server Actions
export async function getServerActionSession(): Promise<
    IronSession<SessionData>
> {
    try {
        const cookieStore = await cookies();

        if (!sessionOptions || !sessionOptions.password) {
            console.error(
                "ERREUR: sessionOptions ou son mot de passe est manquant!"
            );
            throw new Error("Configuration de session invalide");
        }

        const session = await getIronSession<SessionData>(
            cookieStore,
            sessionOptions
        );

        return session;
    } catch (error) {
        console.error(error);
        throw new Error("Erreur de session"); // Gérer l'erreur selon vos besoins
    }
}
