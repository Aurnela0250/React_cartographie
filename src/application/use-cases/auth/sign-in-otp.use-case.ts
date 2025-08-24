import { IAuthRepository } from "@/src/application/repositories/auth.repository.interface";
import { IAuthService } from "@/src/application/services/auth.service.interface";
import { Cookie } from "@/src/entities/models/cookie";

export type ISignInOtpUseCase = ReturnType<typeof signInOtpUseCase>;

export const signInOtpUseCase =
    (authRepository: IAuthRepository, authService: IAuthService) =>
    async (input: {
        email: string;
        otp: string;
    }): Promise<{
        accessTokenCookie: Cookie;
        refreshTokenCookie: Cookie;
        userCookie: Cookie;
    }> => {
        const tokens = await authRepository.signInOtp(input);

        const tokensCookies = await authService.createTokensCookie(
            tokens.accessToken,
            tokens.refreshToken,
            tokens.user
        );

        return tokensCookies;
    };
