import { ISignInOtpUseCase } from "@/src/application/use-cases/auth/sign-in-otp.use-case";

export type ISignInOtpController = ReturnType<typeof signInOtpController>;

export const signInOtpController = (signInOtpUseCase: ISignInOtpUseCase) => {
    return async (input: { email: string; otp: string }) => {
        const tokensCookies = await signInOtpUseCase(input);

        return tokensCookies;
    };
};
