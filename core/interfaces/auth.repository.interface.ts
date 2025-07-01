import { Token } from "@/core/entities/token.entity";
import { User } from "@/core/entities/users.entity";

export interface AuthResponse {
    user: User;
    token: Token;
}

export interface IAuthRepository {
    signup(data: { email: string; password: string }): Promise<User>;
    login(data: { email: string; password: string }): Promise<Token>;
    loginOAuth2(data: {
        username: string;
        password: string;
        grantType?: string;
        scope?: string;
        clientId?: string;
        clientSecret?: string;
    }): Promise<AuthResponse>;
    refresh(refreshToken: string): Promise<Token>;
    me(token: string): Promise<User>;
    logout(token: string, refreshToken: string): Promise<{ message: string }>;
}
