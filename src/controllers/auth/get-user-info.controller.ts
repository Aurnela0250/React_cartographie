import { IGetUserInfoUseCase } from "@/src/application/use-cases/auth/get-user-info.use-case";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { User } from "@/src/entities/models/user";

export type IGetUserInfoController = ReturnType<typeof getUserInfoController>;

export const getUserInfoController = (
    getUserInfoUseCase: IGetUserInfoUseCase
) => {
    return async (token?: string): Promise<User> => {
        if (!token) {
            throw new UnauthenticatedError("Token is required");
        }

        const user = await getUserInfoUseCase(token);

        return user;
    };
};
