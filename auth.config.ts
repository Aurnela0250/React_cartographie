import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { CredentialsSignin } from "@auth/core/errors";

import { Container } from "./infrastructure/store/container";
import { InvalidCredentialsError } from "./shared/errors/errors";

const authConfig: NextAuthConfig = {
    trustHost: true,
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const container = Container.getInstance();
                const authUseCase = container.getAuthUseCase();

                try {
                    const userLogged = await authUseCase.login({
                        email: String(credentials?.email),
                        password: String(credentials?.password),
                    });

                    return userLogged; // Retourne les tokens fournis par l'API
                } catch (error) {
                    console.error("Erreur d'authentification:", error);
                    if (error instanceof InvalidCredentialsError) {
                        throw new CredentialsSignin(
                            error.message || "Identifiants invalides"
                        );
                    }

                    return null;
                }
            },
        }),
    ],
};

export default authConfig;
