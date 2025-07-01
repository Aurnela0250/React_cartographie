import type { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        userId: string;
        exp: number;
        iat: number;
        jti: string;
        tokenType: string;
        iss: string;
        aud: string;
        accessToken: string;
        refreshToken: string;
        user: IUser;
    }

    interface Session extends DefaultSession {
        userId: string;
        exp: number;
        iat: number;
        jti: string;
        tokenType: string;
        iss: string;
        aud: string;
        accessToken: string;
        refreshToken: string;
        user: {
            id?: string;
            name?: string;
            email?: string;
            image?: string;
            [key: string]: unknown;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId: string;
        exp: number;
        iat: number;
        jti: string;
        tokenType: string;
        iss: string;
        aud: string;
        accessToken: string;
        refreshToken: string;
        user: IUser;
    }
}
