import { Token } from "@/src/entities/models/token";
import { User } from "@/src/entities/models/user";

export interface IAuthRepository {
    signUp(data: { email: string; password: string }): Promise<User>;
    signIn(data: {
        email: string;
        password: string;
    }): Promise<{ accessToken: string; refreshToken: string; user: User }>;
    signOut(token: string, refreshToken: string): Promise<{ message: string }>;
    refresh(
        refreshToken: string
    ): Promise<{ accessToken: string; refreshToken: string; user: User }>;
    me(token: string): Promise<User>;
    loginOAuth2(data: {
        username: string;
        password: string;
        grantType?: string;
        scope?: string;
        clientId?: string;
        clientSecret?: string;
    }): Promise<{
        user: User;
        token: Token;
    }>;
}
