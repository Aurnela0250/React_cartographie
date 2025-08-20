import { ISignUpUseCase } from "@/src/application/use-cases/auth/sign-up.use-case";
import { User } from "@/src/entities/models/user";

export type ISignUpController = ReturnType<typeof signUpController>;

export const signUpController = (signUpUseCase: ISignUpUseCase) => {
    return async (input: {
        email: string;
        password: string;
    }): Promise<User> => {
        const user = await signUpUseCase(input);

        return user;
    };
};
