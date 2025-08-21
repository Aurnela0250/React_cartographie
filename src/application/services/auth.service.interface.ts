import { Cookie } from "@/src/entities/models/cookie";
import { User } from "@/src/entities/models/user";

export interface IAuthService {
    createTokensCookie: (
        accessToken: string,
        refreshToken: string,
        user: User
    ) => Promise<{
        accessTokenCookie: Cookie;
        refreshTokenCookie: Cookie;
        userCookie: Cookie;
    }>;
}
