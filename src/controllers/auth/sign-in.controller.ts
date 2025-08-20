import { ISignInUseCase } from "@/src/application/use-cases/auth/sign-in.use-case";

export type ISignInController = ReturnType<typeof signInController>;

export const signInController = (signInUseCase: ISignInUseCase) => {
    return async (input: { email: string; password: string }) => {
        const tokenCookies = await signInUseCase(input);

        return tokenCookies;
    };
};
