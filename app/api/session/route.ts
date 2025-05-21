import { NextRequest, NextResponse } from "next/server";

import { getRouteHandlerSession } from "@/shared/utils/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getRouteHandlerSession(request);

        // Retourner uniquement les données non sensibles au client
        const clientSafeSessionData = {
            isLoggedIn: session.isLoggedIn ?? false,
            user: session.user,
            //   token: session.token,
            // Ne PAS envoyer les tokens au client
        };

        return NextResponse.json(clientSafeSessionData);
    } catch (error) {
        console.error("Erreur API Session GET:", error);

        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
