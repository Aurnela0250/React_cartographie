import { jwtDecode } from "jwt-decode";

import { env } from "@/env.mjs";
import { IAuthService } from "@/src/application/services/auth.service.interface";
import { Cookie } from "@/src/entities/models/cookie";
import { TokenPayload } from "@/src/entities/models/token";
import { User } from "@/src/entities/models/user";

export class AuthService implements IAuthService {
    private async decodeToken(token: string): Promise<TokenPayload> {
        const tokenPayload = jwtDecode<TokenPayload>(token);

        return tokenPayload;
    }

    async createTokensCookie(
        accessToken: string,
        refreshToken: string,
        user: User
    ): Promise<{
        accessTokenCookie: Cookie;
        refreshTokenCookie: Cookie;
        userCookie: Cookie;
    }> {
        const accessTokenPayload = await this.decodeToken(accessToken);
        const refreshTokenPayload = await this.decodeToken(refreshToken);

        const accessTokenCookie: Cookie = {
            name: "accessToken",
            value: accessToken,
            attributes: {
                httpOnly: env.NODE_ENV === "production",
                path: "/",
                maxAge: accessTokenPayload.exp - Math.floor(Date.now() / 1000),
                expires: new Date(accessTokenPayload.exp * 1000),
                sameSite: "lax",
                secure: env.NODE_ENV === "production",
            },
        };

        const refreshTokenCookie: Cookie = {
            name: "refreshToken",
            value: refreshToken,
            attributes: {
                httpOnly: env.NODE_ENV === "production",
                path: "/",
                maxAge: refreshTokenPayload.exp - Math.floor(Date.now() / 1000),
                expires: new Date(refreshTokenPayload.exp * 1000),
                sameSite: "lax",
                secure: env.NODE_ENV === "production",
            },
        };

        const userCookie: Cookie = {
            name: "user",
            value: JSON.stringify(user),
            attributes: {
                httpOnly: env.NODE_ENV === "production",
                path: "/",
                maxAge: refreshTokenPayload.exp - Math.floor(Date.now() / 1000),
                expires: new Date(refreshTokenPayload.exp * 1000),
                sameSite: "lax",
                secure: env.NODE_ENV === "production",
            },
        };

        return {
            accessTokenCookie,
            refreshTokenCookie,
            userCookie,
        };
    }
}
