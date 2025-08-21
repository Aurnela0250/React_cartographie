import { IRefreshTokenUseCase } from "@/src/application/use-cases/auth/refresh-token.use-case";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { Cookie } from "@/src/entities/models/cookie";
import { User } from "@/src/entities/models/user";

export type IRefreshTokenController = ReturnType<typeof refreshTokenController>;

export const refreshTokenController = (
    refreshTokenUseCase: IRefreshTokenUseCase
) => {
    return async (
        refreshToken?: string
    ): Promise<{
        accessTokenCookie: Cookie;
        refreshTokenCookie: Cookie;
        userCookie: Cookie;
    }> => {
        if (!refreshToken) {
            throw new UnauthenticatedError("Must be logged in");
        }

        const tokensCookie = await refreshTokenUseCase({ refreshToken });

        return tokensCookie;
    };
};
