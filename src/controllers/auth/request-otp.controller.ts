import { IRequestOtpUseCase } from "@/src/application/use-cases/auth/request-otp.use-case";

export type IRequestOtpController = ReturnType<typeof requestOtpController>;

export const requestOtpController = (requestOtpUseCase: IRequestOtpUseCase) => {
    return async (input: { email: string }) => {
        const result = await requestOtpUseCase(input);

        return result;
    };
};
