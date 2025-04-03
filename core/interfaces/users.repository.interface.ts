import { UserEntity } from "@/core/domain/entities/users.entity";

export interface IUserRepository {
    getUserByEmail(email: string): Promise<UserEntity | null>;
    getUserById(id: string): Promise<UserEntity | null>;
    createUser(data: { email: string; password: string }): Promise<UserEntity>;
}
