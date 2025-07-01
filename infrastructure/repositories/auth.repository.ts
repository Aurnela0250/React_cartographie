import { Token } from "@/core/entities/token.entity";
import { User } from "@/core/entities/users.entity";
import {
    AuthResponse,
    IAuthRepository,
} from "@/core/interfaces/auth.repository.interface";
import { env } from "@/env.mjs";
import { toCamelCaseRecursive, toSnakeCaseRecursive } from "@/shared/utils";
import { handleApiResponse } from "@/shared/utils/api-errors";
import { ApiError } from "@/shared/utils/api-errors.types";
import { UnauthorizedError } from "@/shared/utils/app-errors";

export class AuthDjangoApiRepository implements IAuthRepository {
    loginOAuth2(_: {
        username: string;
        password: string;
        grantType?: string | undefined;
        scope?: string | undefined;
        clientId?: string | undefined;
        clientSecret?: string | undefined;
    }): Promise<AuthResponse> {
        throw new Error("Method not implemented.");
    }
    async login(data: { email: string; password: string }): Promise<Token> {
        const apiUrl = `${env.API_PREFIX_URL}/${env.API_VERSION}/auth/login`;

        console.log("Login API URL:", apiUrl);

        const payload = toSnakeCaseRecursive(data);
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Important pour les cookies de session
            body: JSON.stringify(payload),
        });

        const dataResponse = await handleApiResponse<unknown>(response);
        const token = Token.fromUnknown(toCamelCaseRecursive(dataResponse));

        return token;
    }

    async signup(data: { email: string; password: string }): Promise<User> {
        const apiUrl = `${env.API_PREFIX_URL}/${env.API_VERSION}/auth/signup`;

        const payload = toSnakeCaseRecursive(data);
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Important pour les cookies de session
            body: JSON.stringify(payload),
        });

        const dataResponse = await handleApiResponse<unknown>(response);
        const user = User.fromUnknown(toCamelCaseRecursive(dataResponse));

        return user;
    }

    async refresh(refreshToken: string): Promise<Token> {
        const apiUrl = `${env.API_PREFIX_URL}/${env.API_VERSION}/auth/refresh?refresh_token=${refreshToken}`;

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await handleApiResponse<unknown>(response);
            const token = Token.fromUnknown(toCamelCaseRecursive(data));

            return token;
        } catch (error) {
            // Enrichir l'erreur avec des informations contextuelles
            console.error(
                "AuthRepository: Erreur lors du rafraîchissement du token",
                {
                    error,
                    refreshTokenPartial: refreshToken
                        ? refreshToken.substring(0, 5) + "..."
                        : "undefined",
                }
            );

            // Si c'est déjà une erreur UnauthorizedError, on la propage avec un message plus explicite
            if (error instanceof ApiError && error.statusCode === 401) {
                const tokenExpiredError = new UnauthorizedError(
                    "Le token de rafraîchissement a expiré ou est invalide",
                    error.details
                ) as UnauthorizedError & {
                    cause?: unknown;
                    errorType?: string;
                };

                tokenExpiredError.cause = error;
                tokenExpiredError.errorType = "TOKEN_REFRESH_EXPIRED";
                throw tokenExpiredError;
            }

            // Sinon on propage une erreur générique de rafraîchissement
            const enhancedError =
                error instanceof Error
                    ? (error as Error & { errorType?: string })
                    : (new ApiError(
                          "Erreur inconnue lors du rafraîchissement du token"
                      ) as ApiError & { errorType?: string });

            enhancedError.errorType = "TOKEN_REFRESH_FAILED";
            throw enhancedError;
        }
    }

    async logout(
        accessToken: string,
        refreshToken: string
    ): Promise<{ message: string }> {
        const apiUrl = `${env.API_PREFIX_URL}/${env.API_VERSION}/auth/logout?refresh_token=${refreshToken}`;

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const dataResponse = await handleApiResponse<unknown>(response);

        return dataResponse as { message: string };
    }

    async me(token: string): Promise<User> {
        const apiUrl = `${env.API_PREFIX_URL}/${env.API_VERSION}/auth/me`;

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            credentials: "include",
        });

        const dataResponse = await handleApiResponse<unknown>(response);
        const user = User.fromUnknown(toCamelCaseRecursive(dataResponse));

        return user;
    }
}
