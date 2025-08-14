import { User } from "@/core/entities/users.entity";
import { ServiceResult } from "@/shared/types/service-result";

import { AuthTokenService } from "./auth-token.service";

/**
 * Niveaux de permissions disponibles
 */
export enum Permission {
    READ = "READ",
    WRITE = "WRITE",
    ADMIN = "ADMIN",
}

/**
 * Contexte d'authentification retourné par le DAL
 */
export interface AuthContext {
    user: User;
    accessToken: string;
}

/**
 * Service DAL (Data Access Layer) pour l'authentification et l'autorisation
 * Intègre avec AuthTokenService pour la gestion des tokens
 * Fournit une couche d'abstraction pour la vérification des permissions
 */
export class DALService {
    private static instance: DALService | null = null;
    private authTokenService: AuthTokenService;

    private constructor() {
        this.authTokenService = AuthTokenService.getInstance();
    }

    /**
     * Récupère l'instance unique du service DAL
     */
    public static getInstance(): DALService {
        if (!DALService.instance) {
            DALService.instance = new DALService();
        }

        return DALService.instance;
    }

    /**
     * Vérifie l'authentification de l'utilisateur
     * Gère automatiquement le refresh token si nécessaire
     */
    async withAuth(): Promise<ServiceResult<AuthContext>> {
        try {
            const authResult = await this.authTokenService.isAuthenticated();

            if (!authResult.authenticated) {
                return ServiceResult.error(
                    authResult.error || "Utilisateur non authentifié"
                );
            }

            if (!authResult.user || !authResult.accessToken) {
                return ServiceResult.error(
                    "Données d'authentification manquantes"
                );
            }

            return ServiceResult.success({
                user: authResult.user,
                accessToken: authResult.accessToken,
            });
        } catch (error) {
            console.error("DAL: Erreur lors de l'authentification:", error);

            return ServiceResult.error(
                "Erreur lors de la vérification d'authentification"
            );
        }
    }

    /**
     * Vérifie l'authentification ET les permissions de l'utilisateur
     */
    async withPermission(
        permission: Permission
    ): Promise<ServiceResult<AuthContext>> {
        // Étape 1: Vérifier l'authentification
        const authResult = await this.withAuth();

        if (!authResult.success) {
            return authResult;
        }

        // Étape 2: Vérifier les permissions
        const hasPermission = this.checkPermission(
            authResult.data!.user,
            permission
        );

        if (!hasPermission) {
            return ServiceResult.error(
                `Permission ${permission} requise pour cette action`
            );
        }

        return authResult;
    }

    /**
     * Vérifie si l'utilisateur a la permission requise
     */
    private checkPermission(user: User, permission: Permission): boolean {
        switch (permission) {
            case Permission.READ:
                // Tous les utilisateurs authentifiés peuvent lire
                return user.active;

            case Permission.WRITE:
                // Seuls les utilisateurs actifs peuvent écrire
                return user.active;

            case Permission.ADMIN:
                // Seuls les admins peuvent effectuer des actions admin
                return user.active && user.isAdmin;

            default:
                return false;
        }
    }
}

// Export de l'instance singleton pour faciliter l'utilisation
export const dalService = DALService.getInstance();