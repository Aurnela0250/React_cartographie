import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSession, SessionOptions } from "session-auth";

import { IToken, Token } from "@/core/entities/token.entity";
import { IUser } from "@/core/entities/users.entity";
import { env } from "@/env.mjs";

// Définition de la structure des données de session
export interface SessionData {
    isLoggedIn?: boolean;
    token?: IToken;
    user?: IUser;
}

// Options de configuration pour iron-session
export const sessionOptions: SessionOptions = {
    password: env.IRON_SESSION_PASSWORD ?? "", // Doit être définie dans les variables d'environnement (min 32 caractères)
    cookieName: "lemon-app-session",
    ttl: 60 * 60 * 24 * 7,
    cookieOptions: {
        secure: env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax" as const,
        maxAge: 60 * 60 * 24 * 7, // 1 semaine (optionnel, sinon cookie de session)
    },
};

// Fonction pour obtenir la session dans les Route Handlers ou Middleware
export async function getRouteHandlerSession(
    req: NextRequest,
    res?: NextResponse
): Promise<IronSession<SessionData>> {
    // Create a response if one is not provided
    const response = res || NextResponse.next();

    const session = await getIronSession<SessionData>(
        req,
        response,
        sessionOptions
    );

    return session;
}

// Fonction pour convertir un objet Token en données de session
export function tokenToSessionData(token: Token): Partial<SessionData> {
    if (
        !token.accessToken ||
        !token.refreshToken ||
        !token.exp ||
        !token.user
    ) {
        throw new Error("Données de token incomplètes");
    }

    const { user: _user, ..._token } = token;

    return {
        isLoggedIn: true,
        token: _token,
        user: _user,
    };
}
