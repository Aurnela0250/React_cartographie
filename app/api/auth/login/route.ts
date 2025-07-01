import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { AuthDjangoApiRepository } from "@/infrastructure/repositories/auth.repository";
import { loginSchema } from "@/presentation/schemas/auth.schema";
import { UnauthorizedError } from "@/shared/utils/app-errors";

const authRepository = new AuthDjangoApiRepository();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validation des données d'entrée
        const validationResult = loginSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Données invalides",
                    details: validationResult.error.errors,
                },
                { status: 400 }
            );
        }

        const { email, password } = validationResult.data;

        // Appel au repository pour l'authentification
        const tokenData = await authRepository.login({ email, password });

        // Vérifier que les données de token sont complètes
        if (
            !tokenData ||
            !tokenData.accessToken ||
            !tokenData.refreshToken ||
            !tokenData.exp
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Échec de connexion: données de token incomplètes",
                },
                { status: 500 }
            );
        }

        // Calculer la durée jusqu'à l'expiration
        const getTimeUntilExpiry = (exp: number): number => {
            const currentTimeUTC = Math.floor(
                Date.UTC(
                    new Date().getUTCFullYear(),
                    new Date().getUTCMonth(),
                    new Date().getUTCDate(),
                    new Date().getUTCHours(),
                    new Date().getUTCMinutes(),
                    new Date().getUTCSeconds()
                ) / 1000
            );

            return Math.max(0, exp - currentTimeUTC);
        };

        const cookieStore = await cookies();

        // Stockage sécurisé des tokens
        cookieStore.set("accessToken", tokenData.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: getTimeUntilExpiry(tokenData.exp),
            path: "/",
        });

        cookieStore.set("refreshToken", tokenData.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60, // 7 jours
            path: "/",
        });

        // Stocker les métadonnées du token pour le middleware
        cookieStore.set(
            "tokenMeta",
            JSON.stringify({
                exp: tokenData.exp,
                iat: tokenData.iat,
                userId: tokenData.userId,
            }),
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: getTimeUntilExpiry(tokenData.exp),
                path: "/",
            }
        );

        // Récupérer l'URL de redirection depuis les paramètres de requête
        const redirectTo =
            request.nextUrl.searchParams.get("redirectTo") || "/dashboard";

        return NextResponse.json({
            success: true,
            redirectTo,
            user: {
                id: tokenData.user.id,
                email: tokenData.user.email,
                active: tokenData.user.active,
                isAdmin: tokenData.user.isAdmin,
            },
        });
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);

        // Gérer les erreurs spécifiques
        if (error instanceof UnauthorizedError) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Email ou mot de passe incorrect",
                },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: "Une erreur est survenue lors de la connexion",
            },
            { status: 500 }
        );
    }
}
