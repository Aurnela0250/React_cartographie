import { User } from "../entities/users.entity";

export interface IUserRepository {
    getUserByEmail(email: string): Promise<User | null>;
    getUserById(id: number): Promise<User | null>;
    createUser(userData: { email: string; password: string }): Promise<User>;
}
