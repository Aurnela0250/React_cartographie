// auth.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

import authConfig from "./auth.config";

function isTokenExpired(expirationTime: number): boolean {
    return Date.now() >= expirationTime;
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        const response = await fetch(
            `${process.env.INTERNAL_API_URL}/refresh/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refresh_token: token.refresh_token.refresh_token,
                }),
            }
        );

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        const iatDate = new Date(refreshedTokens.iat);

        return {
            ...token,
            access_token: refreshedTokens.access_token,
            refresh_token: refreshedTokens.refresh_token,
            token_type: refreshedTokens.token_type,
            iat: refreshedTokens.iat,
            accessTokenExpires:
                iatDate.getTime() +
                refreshedTokens.access_token.expires_in * 1000,
            refreshTokenExpires:
                iatDate.getTime() +
                refreshedTokens.refresh_token.expires_in * 1000,
        };
    } catch (error) {
        console.error("Erreur lors du rafraîchissement du token", error);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const {
    handlers: { GET, POST },
    signIn,
    signOut,
    auth,
} = NextAuth({
    callbacks: {
        async jwt({ token, user }) {
            // if (!user.access_token) return token;

            let accessTokenExpires = 0;
            let refreshTokenExpires = 0;

            if (user) {
                const userLogged = user;
                const iatDate = new Date(userLogged.iat);

                token.user = userLogged;
                accessTokenExpires =
                    iatDate.getTime() +
                    userLogged.access_token.expires_in * 1000;

                refreshTokenExpires =
                    iatDate.getTime() +
                    userLogged.refresh_token.expires_in * 1000;
            }

            if (isTokenExpired(refreshTokenExpires)) {
                return {};
            }

            if (isTokenExpired(accessTokenExpires)) {
                return refreshAccessToken(token);
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: "user_id", // Mettre ici l'ID de l'utilisateur
                };
                session.access_token = token.access_token;
                session.refresh_token = token.refresh_token;
                session.token_type = token.token_type;
            }

            return session;
        },
    },
    ...authConfig,
});
