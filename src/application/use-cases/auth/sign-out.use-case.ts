import { IAuthRepository } from "../../repositories/auth.repository.interface";

export type ISignOutUseCase = ReturnType<typeof signOutUseCase>;

export const signOutUseCase =
    (authRepository: IAuthRepository) =>
    async (input: {
        accessToken: string;
        refreshToken: string;
    }): Promise<{ message: string }> => {
        const { accessToken, refreshToken } = input;

        const message = await authRepository.signOut(accessToken, refreshToken);

        return message;
    };
