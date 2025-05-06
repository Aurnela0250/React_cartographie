import { Token } from "@/core/domain/entities/token.entity";
import { User } from "@/core/domain/entities/users.entity";

export interface IAuthRepository {
    login(email: string, password: string): Promise<Token>;
    register(email: string, password: string): Promise<User>;
    refreshToken(token: string): Promise<Token>;
    logout(accessToken: string, refreshToken: string): Promise<void>;
    me(token: string): Promise<User>;
}
