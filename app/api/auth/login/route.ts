import { NextRequest, NextResponse } from "next/server";

import { AuthTokenService } from "@/infrastructure/services/auth-token.service";
import { loginSchema } from "@/presentation/schemas/auth.schema";
import { UnauthorizedError } from "@/shared/utils/app-errors";

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

        // Utiliser le service centralisé pour la connexion
        const authService = AuthTokenService.getInstance();
        const loginResult = await authService.login(email, password);

        if (!loginResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: loginResult.error || "Échec de connexion",
                },
                { status: 401 }
            );
        }

        // Récupérer l'URL de redirection depuis les paramètres de requête
        const redirectTo =
            request.nextUrl.searchParams.get("redirectTo") || "/";

        return NextResponse.json({
            success: true,
            redirectTo,
            user: {
                id: loginResult.user!.id,
                email: loginResult.user!.email,
                active: loginResult.user!.active,
                isAdmin: loginResult.user!.isAdmin,
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
