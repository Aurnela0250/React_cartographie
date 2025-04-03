import { IAuthRepository } from "@/core/interfaces/auth.repository.interface";
import { login, UserLogged } from "@/presentation/schemas/auth.schema";
import { InternalServerError, NotFoundError } from "@/shared/errors/errors";

export class AuthRepository implements IAuthRepository {
    async login({ email, password }: login): Promise<UserLogged> {
        const response = await fetch(`${process.env.INTERNAL_API_URL}/login`, {
            body: JSON.stringify({ email, password }),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            if (response.status === 400) throw new NotFoundError("Utilisateur");
            if (response.status === 500) throw new InternalServerError();
        }

        const data = await response.json();

        const userLogged: UserLogged = {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            token_type: data.token_type,
            iat: data.iat,
        };

        return userLogged;
    }

    register(credential: {
        email: string;
        password: string;
    }): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}
