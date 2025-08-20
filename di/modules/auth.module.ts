import { getUserInfoUseCase } from "@/src/application/use-cases/auth/get-user-info.use-case";
import { refreshTokenUseCase } from "@/src/application/use-cases/auth/refresh-token.use-case";
import { signInUseCase } from "@/src/application/use-cases/auth/sign-in.use-case";
import { signOutUseCase } from "@/src/application/use-cases/auth/sign-out.use-case";
import { signUpUseCase } from "@/src/application/use-cases/auth/sign-up.use-case";
import { getUserInfoController } from "@/src/controllers/auth/get-user-info.controller";
import { refreshTokenController } from "@/src/controllers/auth/refresh-token.controller";
import { signInController } from "@/src/controllers/auth/sign-in.controller";
import { signOutController } from "@/src/controllers/auth/sign-out.controller";
import { signUpController } from "@/src/controllers/auth/sign-up.controller";
import { AuthRepository } from "@/src/infrastructure/repositories/auth.repository";
import { AuthService } from "@/src/infrastructure/services/auth.service";
import { createModule } from "@evyweb/ioctopus";

import { DI_SYMBOLS } from "../types";

export const createAuthModule = () => {
    const authModule = createModule();

    authModule.bind(DI_SYMBOLS.IAuthRepository).toClass(AuthRepository);
    authModule.bind(DI_SYMBOLS.IAuthService).toClass(AuthService);

    authModule
        .bind(DI_SYMBOLS.ISignInUseCase)
        .toHigherOrderFunction(signInUseCase, [
            DI_SYMBOLS.IAuthRepository,
            DI_SYMBOLS.IAuthService,
        ]);

    authModule
        .bind(DI_SYMBOLS.ISignInController)
        .toHigherOrderFunction(signInController, [DI_SYMBOLS.ISignInUseCase]);

    authModule
        .bind(DI_SYMBOLS.ISignUpUseCase)
        .toHigherOrderFunction(signUpUseCase, [DI_SYMBOLS.IAuthRepository]);

    authModule
        .bind(DI_SYMBOLS.ISignUpController)
        .toHigherOrderFunction(signUpController, [DI_SYMBOLS.ISignUpUseCase]);

    authModule
        .bind(DI_SYMBOLS.ISignOutUseCase)
        .toHigherOrderFunction(signOutUseCase, [DI_SYMBOLS.IAuthRepository]);

    authModule
        .bind(DI_SYMBOLS.ISignOutController)
        .toHigherOrderFunction(signOutController, [DI_SYMBOLS.ISignOutUseCase]);

    authModule
        .bind(DI_SYMBOLS.IRefreshTokenUseCase)
        .toHigherOrderFunction(refreshTokenUseCase, [
            DI_SYMBOLS.IAuthRepository,
            DI_SYMBOLS.IAuthService,
        ]);

    authModule
        .bind(DI_SYMBOLS.IRefreshTokenController)
        .toHigherOrderFunction(refreshTokenController, [
            DI_SYMBOLS.IRefreshTokenUseCase,
        ]);

    authModule
        .bind(DI_SYMBOLS.IGetUserInfoUseCase)
        .toHigherOrderFunction(getUserInfoUseCase, [
            DI_SYMBOLS.IAuthRepository,
        ]);

    authModule
        .bind(DI_SYMBOLS.IGetUserInfoController)
        .toHigherOrderFunction(getUserInfoController, [
            DI_SYMBOLS.IGetUserInfoUseCase,
        ]);

    return authModule;
};
