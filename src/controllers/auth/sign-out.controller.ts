import { ISignOutUseCase } from "@/src/application/use-cases/auth/sign-out.use-case";
import { UnauthenticatedError } from "@/src/entities/errors/auth";

export type ISignOutController = ReturnType<typeof signOutController>;

export const signOutController = (signOutUseCase: ISignOutUseCase) => {
    return async (input: { accessToken?: string; refreshToken?: string }) => {
        const { accessToken, refreshToken } = input;
        if (!accessToken) {
            throw new UnauthenticatedError("Must be logged in");
        }

        if (!refreshToken) {
            throw new UnauthenticatedError("Must be logged in");
        }

        const message = await signOutUseCase({
            accessToken,
            refreshToken,
        });

        return message;
    };
};
