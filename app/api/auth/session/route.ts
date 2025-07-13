import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

/**
 * Endpoint /api/auth/session inspiré d'Auth.js
 * Retourne la session actuelle au format standardisé
 *
 * Compatible avec:
 * - useSession() hook côté client
 * - Polling automatique
 * - SSR hydration
 */
export async function GET(_: NextRequest) {
    try {
        const session = await auth();

        // Retourner la session au format Auth.js standard
        return NextResponse.json({
            user: session?.user || null,
            expires: session?.expires || null,
        });
    } catch (error) {
        console.error("Session API: Erreur lors de la récupération:", error);

        return NextResponse.json(
            {
                user: null,
                expires: null,
                error: "Erreur serveur",
            },
            { status: 500 }
        );
    }
}
