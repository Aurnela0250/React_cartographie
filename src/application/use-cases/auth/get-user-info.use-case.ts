import { IAuthRepository } from "@/src/application/repositories/auth.repository.interface";
import { User } from "@/src/entities/models/user";

export type IGetUserInfoUseCase = ReturnType<typeof getUserInfoUseCase>;

export const getUserInfoUseCase =
    (authRepository: IAuthRepository) =>
    async (token: string): Promise<User> => {
        const user = await authRepository.me(token);

        return user;
    };
