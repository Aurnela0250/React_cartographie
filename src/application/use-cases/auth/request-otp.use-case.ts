import { IAuthRepository } from "@/src/application/repositories/auth.repository.interface";

export type IRequestOtpUseCase = ReturnType<typeof requestOtpUseCase>;

export const requestOtpUseCase =
    (authRepository: IAuthRepository) =>
    async (input: {
        email: string;
    }): Promise<{ message: string; expiresInMinutes: number }> => {
        return await authRepository.requestOtp(input);
    };
