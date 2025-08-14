import { IAuthRepository } from "@/src/application/repositories/auth.repository.interface";
import { IAuthService } from "@/src/application/services/auth.service.interface";
import { User } from "@/src/entities/models/user";

export type ISignUpUseCase = ReturnType<typeof signUpUseCase>;

export const signUpUseCase =
    (authRepository: IAuthRepository) =>
    async (input: { email: string; password: string }): Promise<User> => {
        const user = await authRepository.signUp(input);

        return user;
    };
