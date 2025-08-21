import { env } from "@/env.mjs";
import {
    handleApiResponse,
    toCamelCaseRecursive,
    toSnakeCaseRecursive,
} from "@/shared/utils";
import { IAuthRepository } from "@/src/application/repositories/auth.repository.interface";
import { Token } from "@/src/entities/models/token";
import { User } from "@/src/entities/models/user";

export class AuthRepository implements IAuthRepository {
    async signUp(data: { email: string; password: string }): Promise<User> {
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

        const dataResponse = await handleApiResponse<User>(response);

        const user = toCamelCaseRecursive(dataResponse);

        return user;
    }
    async signIn(data: {
        email: string;
        password: string;
    }): Promise<{ accessToken: string; refreshToken: string; user: User }> {
        const apiUrl = `${env.API_PREFIX_URL}/${env.API_VERSION}/auth/login`;

        const payload = toSnakeCaseRecursive(data);

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Important pour les cookies de session
            body: JSON.stringify(payload),
        });

        const dataResponse = await handleApiResponse<Token & { user: User }>(
            response
        );

        const result = toCamelCaseRecursive(dataResponse);

        return result;
    }
    async signOut(
        token: string,
        refreshToken: string
    ): Promise<{ message: string }> {
        const apiUrl = `${env.API_PREFIX_URL}/${env.API_VERSION}/auth/logout?refresh_token=${refreshToken}`;

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const dataResponse = await handleApiResponse<unknown>(response);

        return dataResponse as { message: string };
    }
    async refresh(
        refreshToken: string
    ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
        const apiUrl = `${env.API_PREFIX_URL}/${env.API_VERSION}/auth/refresh?refresh_token=${refreshToken}`;

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Important pour les cookies de session
        });

        const dataResponse = await handleApiResponse<Token & { user: User }>(
            response
        );

        const result = toCamelCaseRecursive(dataResponse);

        return result;
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

        const dataResponse = await handleApiResponse<User>(response);

        const user = toCamelCaseRecursive(dataResponse);

        return user;
    }
    loginOAuth2(_: {
        username: string;
        password: string;
        grantType?: string;
        scope?: string;
        clientId?: string;
        clientSecret?: string;
    }): Promise<{ user: User; token: Token }> {
        throw new Error("Method not implemented.");
    }
}
