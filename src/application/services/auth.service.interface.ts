import { Cookie } from "@/src/entities/models/cookie";

export interface IAuthService {
    createTokensCookie: (
        accessToken: string,
        refreshToken: string
    ) => Promise<{
        accessTokenCookie: Cookie;
        refreshTokenCookie: Cookie;
    }>;
    refreshTokensCookie: (refreshToken: string) => Promise<{
        accessTokenCookie: Cookie;
        refreshTokenCookie: Cookie;
    }>;
    validateTokensCookie: () => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    invalidateTokensCookie: () => Promise<void>;
}
