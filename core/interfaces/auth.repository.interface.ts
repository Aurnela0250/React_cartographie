import { login, UserLogged } from "@/presentation/schemas/auth.schema";

export interface IAuthRepository {
    login(credential: login): Promise<UserLogged>;
    register(credential: { email: string; password: string }): Promise<boolean>;
}
