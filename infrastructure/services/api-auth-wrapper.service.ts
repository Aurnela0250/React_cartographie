import { NextRequest, NextResponse } from "next/server";

import { User } from "@/core/entities/users.entity";

import { AuthTokenService } from "./auth-token.service";

interface AuthenticatedRequest extends NextRequest {
    user: User;
    accessToken: string;
}

interface AuthWrapperResult {
    authenticated: boolean;
    request?: AuthenticatedRequest;
    response?: NextResponse;
}

/**
 * Service wrapper pour l'authentification des API routes
 * Centralise la vérification d'authentification avec refresh automatique
 */
export class ApiAuthWrapperService {
    private static instance: ApiAuthWrapperService | null = null;
    private authTokenService: AuthTokenService;

    private constructor() {
        this.authTokenService = AuthTokenService.getInstance();
    }

    /**
     * Récupère l'instance unique du wrapper
     */
    public static getInstance(): ApiAuthWrapperService {
        if (!ApiAuthWrapperService.instance) {
            ApiAuthWrapperService.instance = new ApiAuthWrapperService();
        }

        return ApiAuthWrapperService.instance;
    }

    /**
     * Wrapper principal pour les API routes protégées
     * Vérifie l'authentification avec refresh automatique
     */
    async withAuth(request: NextRequest): Promise<AuthWrapperResult> {
        try {
            // Utiliser le service centralisé pour vérifier l'authentification
            const authResult = await this.authTokenService.isAuthenticated();

            if (!authResult.authenticated) {
                console.log("ApiAuthWrapper: Utilisateur non authentifié");

                return {
                    authenticated: false,
                    response: NextResponse.json(
                        {
                            error: "Non authentifié",
                            requiresLogin: authResult.requiresLogin || false,
                        },
                        { status: 401 }
                    ),
                };
            }

            // Créer une request augmentée avec les données d'authentification
            const authenticatedRequest = Object.assign(request, {
                user: authResult.user!,
                accessToken: authResult.accessToken!,
            }) as AuthenticatedRequest;

            return {
                authenticated: true,
                request: authenticatedRequest,
            };
        } catch (error) {
            console.error(
                "ApiAuthWrapper: Erreur lors de la vérification:",
                error
            );

            return {
                authenticated: false,
                response: NextResponse.json(
                    {
                        error: "Erreur lors de la vérification d'authentification",
                    },
                    { status: 500 }
                ),
            };
        }
    }

    /**
     * Wrapper pour les API routes avec vérification de rôle admin
     */
    async withAdminAuth(request: NextRequest): Promise<AuthWrapperResult> {
        const authResult = await this.withAuth(request);

        if (!authResult.authenticated) {
            return authResult;
        }

        // Vérifier si l'utilisateur est admin
        if (!authResult.request!.user.isAdmin) {
            console.log("ApiAuthWrapper: Accès admin requis");

            return {
                authenticated: false,
                response: NextResponse.json(
                    { error: "Accès administrateur requis" },
                    { status: 403 }
                ),
            };
        }

        return authResult;
    }

    /**
     * Helper pour créer des handlers d'API route protégées
     */
    createProtectedHandler(
        handler: (request: AuthenticatedRequest) => Promise<NextResponse>
    ): (request: NextRequest) => Promise<NextResponse> {
        return async (request: NextRequest) => {
            const authResult = await this.withAuth(request);

            if (!authResult.authenticated) {
                return authResult.response!;
            }

            return handler(authResult.request!);
        };
    }

    /**
     * Helper pour créer des handlers d'API route admin
     */
    createAdminHandler(
        handler: (request: AuthenticatedRequest) => Promise<NextResponse>
    ): (request: NextRequest) => Promise<NextResponse> {
        return async (request: NextRequest) => {
            const authResult = await this.withAdminAuth(request);

            if (!authResult.authenticated) {
                return authResult.response!;
            }

            return handler(authResult.request!);
        };
    }
}

// Export des types utilitaires
export type { AuthenticatedRequest };

// Export de l'instance singleton pour faciliter l'utilisation
export const apiAuthWrapper = ApiAuthWrapperService.getInstance();
