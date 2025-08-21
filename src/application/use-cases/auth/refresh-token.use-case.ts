import { IAuthRepository } from "@/src/application/repositories/auth.repository.interface";
import { IAuthService } from "@/src/application/services/auth.service.interface";
import { Cookie } from "@/src/entities/models/cookie";
import { User } from "@/src/entities/models/user";

export type IRefreshTokenUseCase = ReturnType<typeof refreshTokenUseCase>;

export const refreshTokenUseCase =
    (authRepository: IAuthRepository, authService: IAuthService) =>
    async (input: {
        refreshToken: string;
    }): Promise<{
        accessTokenCookie: Cookie;
        refreshTokenCookie: Cookie;
        userCookie: Cookie;
    }> => {
        const tokens = await authRepository.refresh(input.refreshToken);

        return await authService.createTokensCookie(
            tokens.accessToken,
            tokens.refreshToken,
            tokens.user
        );
    };
