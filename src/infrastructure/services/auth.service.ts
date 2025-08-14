import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

import { AccessTokenSchema } from "@/presentation/schemas/auth.schema";
import { IAuthRepository } from "@/src/application/repositories/auth.repository.interface";
import { IAuthService } from "@/src/application/services/auth.service.interface";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { Cookie } from "@/src/entities/models/cookie";
import { TokenPayload } from "@/src/entities/models/token";

export class AuthService implements IAuthService {
    constructor(private readonly _authRepository: IAuthRepository) {}

    private async decodeToken(token: string): Promise<TokenPayload> {
        const tokenPayload = jwtDecode<TokenPayload>(token);

        return tokenPayload;
    }

    private async setCookie(cookie: Cookie): Promise<void> {
        const cookieStore = await cookies();

        cookieStore.set(cookie.name, cookie.value, {
            httpOnly: cookie.attributes.httpOnly,
            path: cookie.attributes.path,
            maxAge: cookie.attributes.maxAge,
            expires: cookie.attributes.expires,
            sameSite: cookie.attributes.sameSite,
            secure: cookie.attributes.secure,
            domain: cookie.attributes.domain,
        });
    }

    // Méthode principale simplifiée - orchestration uniquement
    async validateTokensCookie(): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const { accessToken, refreshToken } =
            await this.retrieveTokensFromCookies();

        if (!refreshToken) {
            throw new UnauthenticatedError("Tokens not found in cookies");
        }

        if (!accessToken) {
            return await this.refreshAndUpdateTokens(refreshToken);
        }

        return {
            accessToken,
            refreshToken,
        };
    }

    // Responsabilité 1: Récupération des cookies
    private async retrieveTokensFromCookies(): Promise<{
        accessToken: string | null;
        refreshToken: string | null;
    }> {
        const cookieStore = await cookies();
        const accessTokenCookie = cookieStore.get("accessToken");
        const refreshTokenCookie = cookieStore.get("refreshToken");

        return {
            accessToken: accessTokenCookie?.value || null,
            refreshToken: refreshTokenCookie?.value || null,
        };
    }

    // Responsabilité 2: Rafraîchissement et mise à jour des tokens
    private async refreshAndUpdateTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const newTokens = await this._authRepository.refresh(refreshToken);
        await this.updateTokenCookies(newTokens);

        return {
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
        };
    }

    // Responsabilité 3: Mise à jour des cookies avec les nouveaux tokens
    private async updateTokenCookies(tokens: {
        accessToken: string;
        refreshToken: string;
    }): Promise<void> {
        const accessTokenCookie = await this.createTokenCookie(
            "accessToken",
            tokens.accessToken
        );
        const refreshTokenCookie = await this.createTokenCookie(
            "refreshToken",
            tokens.refreshToken
        );

        await this.setCookie(accessTokenCookie);
        await this.setCookie(refreshTokenCookie);
    }

    // Responsabilité 4: Création d'un cookie pour un token spécifique
    private async createTokenCookie(
        name: string,
        tokenValue: string
    ): Promise<Cookie> {
        const tokenPayload = await this.decodeToken(tokenValue);
        const maxAge = tokenPayload.exp - Math.floor(Date.now() / 1000);

        return {
            name,
            value: tokenValue,
            attributes: {
                httpOnly: true,
                path: "/",
                maxAge,
                expires: new Date(tokenPayload.exp * 1000),
                sameSite: "lax",
                secure: false,
            },
        };
    }

    async createTokensCookie(
        accessToken: string,
        refreshToken: string
    ): Promise<{ accessTokenCookie: Cookie; refreshTokenCookie: Cookie }> {
        const accessTokenPayload = await this.decodeToken(accessToken);
        const refreshTokenPayload = await this.decodeToken(refreshToken);

        const accessTokenCookie: Cookie = {
            name: "accessToken",
            value: accessToken,
            attributes: {
                httpOnly: true,
                path: "/",
                maxAge: accessTokenPayload.exp - Math.floor(Date.now() / 1000),
                expires: new Date(accessTokenPayload.exp * 1000),
                sameSite: "lax",
                secure: true,
            },
        };

        const refreshTokenCookie: Cookie = {
            name: "refreshToken",
            value: refreshToken,
            attributes: {
                httpOnly: true,
                path: "/",
                maxAge: refreshTokenPayload.exp - Math.floor(Date.now() / 1000),
                expires: new Date(refreshTokenPayload.exp * 1000),
                sameSite: "lax",
                secure: true,
            },
        };

        // Set cookies using the private setCookie method
        // await this.setCookie(accessTokenCookie);
        // await this.setCookie(refreshTokenCookie);

        return {
            accessTokenCookie,
            refreshTokenCookie,
        };
    }
    async refreshTokensCookie(
        refreshToken: string
    ): Promise<{ accessTokenCookie: Cookie; refreshTokenCookie: Cookie }> {
        throw new Error("Method not implemented");
    }

    async invalidateTokensCookie(): Promise<void> {
        const cookieStore = await cookies();

        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
    }
}
