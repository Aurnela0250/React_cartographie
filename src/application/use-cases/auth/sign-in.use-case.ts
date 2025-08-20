import { IAuthRepository } from "@/src/application/repositories/auth.repository.interface";
import { IAuthService } from "@/src/application/services/auth.service.interface";
import { Cookie } from "@/src/entities/models/cookie";
import { User } from "@/src/entities/models/user";

export type ISignInUseCase = ReturnType<typeof signInUseCase>;

export const signInUseCase =
    (authRepository: IAuthRepository, authService: IAuthService) =>
    async (input: {
        email: string;
        password: string;
    }): Promise<{
        accessTokenCookie: Cookie;
        refreshTokenCookie: Cookie;
        userCookie: Cookie;
    }> => {
        const tokens = await authRepository.signIn(input);

        const tokensCookies = await authService.createTokensCookie(
            tokens.accessToken,
            tokens.refreshToken,
            tokens.user
        );

        return tokensCookies;
    };
