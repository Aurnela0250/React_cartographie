import { City } from "@/core/entities/city.entity";
import { PaginationParams } from "@/core/entities/pagination";
import { CityApiRepository } from "@/infrastructure/repositories/city.repository";
import { Option } from "@/presentation/components/ui/multiselect";
import { ServiceResult } from "@/shared/types/service-result";

import { dalService, Permission } from "./dal.service";

/**
 * Service métier pour la gestion des villes
 * Utilise le DAL pour l'authentification et l'autorisation
 * Fournit des méthodes adaptées aux besoins de l'interface utilisateur
 */
export class CityService {
    private static instance: CityService | null = null;
    private cityRepository: CityApiRepository;

    private constructor() {
        this.cityRepository = new CityApiRepository();
    }

    /**
     * Récupère l'instance unique du service
     */
    public static getInstance(): CityService {
        if (!CityService.instance) {
            CityService.instance = new CityService();
        }

        return CityService.instance;
    }

    /**
     * Récupère toutes les villes pour le composant CitySelector
     * Utilise perPage=100 pour récupérer un maximum de villes
     */
    async getCitiesForSelector(): Promise<ServiceResult<Option[]>> {
        try {
            // Étape 1: Vérifier l'authentification et les permissions
            const authResult = await dalService.withPermission(Permission.READ);

            if (!authResult.success) {
                return ServiceResult.error(authResult.error!);
            }

            // Étape 2: Récupérer les villes via le repository
            const paginationParams: PaginationParams = {
                page: 1,
                perPage: 100,
            };

            const citiesResult = await this.cityRepository.getAll(
                authResult.data!.accessToken,
                paginationParams
            );

            // Étape 3: Transformer les données en format Option[] pour MultipleSelector
            const citiesOptions: Option[] = citiesResult.items.map((city) => ({
                value: city.id?.toString() || "",
                label: city.name || "",
            }));

            return ServiceResult.success(citiesOptions);
        } catch (error) {
            console.error("CityService: Erreur lors de la récupération des villes:", error);

            const errorMessage = error instanceof Error 
                ? error.message 
                : "Erreur lors du chargement des villes";

            return ServiceResult.error(errorMessage);
        }
    }

    /**
     * Récupère toutes les villes avec pagination
     */
    async getAllCities(
        paginationParams: PaginationParams
    ): Promise<ServiceResult<City[]>> {
        try {
            // Vérifier l'authentification et les permissions
            const authResult = await dalService.withPermission(Permission.READ);

            if (!authResult.success) {
                return ServiceResult.error(authResult.error!);
            }

            // Récupérer les villes via le repository
            const citiesResult = await this.cityRepository.getAll(
                authResult.data!.accessToken,
                paginationParams
            );

            return ServiceResult.success(citiesResult.items);
        } catch (error) {
            console.error("CityService: Erreur lors de la récupération des villes:", error);

            const errorMessage = error instanceof Error 
                ? error.message 
                : "Erreur lors du chargement des villes";

            return ServiceResult.error(errorMessage);
        }
    }

    /**
     * Récupère une ville par son ID
     */
    async getCityById(id: number): Promise<ServiceResult<City>> {
        try {
            // Vérifier l'authentification et les permissions
            const authResult = await dalService.withPermission(Permission.READ);

            if (!authResult.success) {
                return ServiceResult.error(authResult.error!);
            }

            // Récupérer la ville via le repository
            const city = await this.cityRepository.get(
                authResult.data!.accessToken,
                id
            );

            return ServiceResult.success(city);
        } catch (error) {
            console.error("CityService: Erreur lors de la récupération de la ville:", error);

            const errorMessage = error instanceof Error 
                ? error.message 
                : "Erreur lors du chargement de la ville";

            return ServiceResult.error(errorMessage);
        }
    }
}

// Export de l'instance singleton pour faciliter l'utilisation
export const cityService = CityService.getInstance();