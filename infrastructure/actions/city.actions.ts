'use server'

import { cache } from 'react';

import { City } from '@/core/entities/city.entity';
import { PaginationParams } from '@/core/entities/pagination';
import { CityApiRepository } from '@/infrastructure/repositories/city.repository';
import { Option } from '@/presentation/components/ui/multiselect';
import { ServiceResult } from '@/shared/types/service-result';

import { verifySession, checkUserPermission } from './auth.actions';

/**
 * Server Actions pour la gestion des villes avec React cache
 * Utilise l'authentification via Server Actions
 */

/**
 * Récupère toutes les villes pour le CitySelector avec mise en cache
 * Authentification et autorisation intégrées
 */
export const getCitiesForSelector = cache(async (): Promise<ServiceResult<Option[]>> => {
    try {
        // Vérification de l'authentification
        const sessionResult = await verifySession();
        
        if (!sessionResult.isAuthenticated) {
            return ServiceResult.error(
                sessionResult.error || 'Utilisateur non authentifié'
            );
        }

        // Vérification des permissions
        const permissionResult = await checkUserPermission('READ');
        
        if (!permissionResult.success) {
            return ServiceResult.error(permissionResult.error!);
        }

        if (!permissionResult.data) {
            return ServiceResult.error('Permission de lecture requise');
        }

        // Récupération des villes
        const cityRepository = new CityApiRepository();
        const paginationParams: PaginationParams = {
            page: 1,
            perPage: 100,
        };

        const citiesResult = await cityRepository.getAll(
            sessionResult.accessToken!,
            paginationParams
        );

        // Transformation en format Option[] pour MultipleSelector
        const citiesOptions: Option[] = citiesResult.items.map((city) => ({
            value: city.id?.toString() || "",
            label: city.name || "",
        }));

        return ServiceResult.success(citiesOptions);
    } catch (error) {
        console.error('Erreur lors de la récupération des villes:', error);
        
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'Erreur lors du chargement des villes';

        return ServiceResult.error(errorMessage);
    }
});

/**
 * Récupère toutes les villes avec pagination
 */
export const getAllCities = cache(async (
    paginationParams: PaginationParams
): Promise<ServiceResult<City[]>> => {
    try {
        // Vérification de l'authentification
        const sessionResult = await verifySession();
        
        if (!sessionResult.isAuthenticated) {
            return ServiceResult.error(
                sessionResult.error || 'Utilisateur non authentifié'
            );
        }

        // Vérification des permissions
        const permissionResult = await checkUserPermission('READ');
        
        if (!permissionResult.success) {
            return ServiceResult.error(permissionResult.error!);
        }

        if (!permissionResult.data) {
            return ServiceResult.error('Permission de lecture requise');
        }

        // Récupération des villes
        const cityRepository = new CityApiRepository();
        const citiesResult = await cityRepository.getAll(
            sessionResult.accessToken!,
            paginationParams
        );

        return ServiceResult.success(citiesResult.items);
    } catch (error) {
        console.error('Erreur lors de la récupération des villes:', error);
        
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'Erreur lors du chargement des villes';

        return ServiceResult.error(errorMessage);
    }
});

/**
 * Récupère une ville par son ID
 */
export const getCityById = cache(async (id: number): Promise<ServiceResult<City>> => {
    try {
        // Vérification de l'authentification
        const sessionResult = await verifySession();
        
        if (!sessionResult.isAuthenticated) {
            return ServiceResult.error(
                sessionResult.error || 'Utilisateur non authentifié'
            );
        }

        // Vérification des permissions
        const permissionResult = await checkUserPermission('READ');
        
        if (!permissionResult.success) {
            return ServiceResult.error(permissionResult.error!);
        }

        if (!permissionResult.data) {
            return ServiceResult.error('Permission de lecture requise');
        }

        // Récupération de la ville
        const cityRepository = new CityApiRepository();
        const city = await cityRepository.get(sessionResult.accessToken!, id);

        return ServiceResult.success(city);
    } catch (error) {
        console.error('Erreur lors de la récupération de la ville:', error);
        
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'Erreur lors du chargement de la ville';

        return ServiceResult.error(errorMessage);
    }
});

/**
 * Crée une nouvelle ville (admin uniquement)
 */
export async function createCity(cityData: Partial<City>): Promise<ServiceResult<City>> {
    try {
        // Vérification de l'authentification
        const sessionResult = await verifySession();
        
        if (!sessionResult.isAuthenticated) {
            return ServiceResult.error(
                sessionResult.error || 'Utilisateur non authentifié'
            );
        }

        // Vérification des permissions admin
        const permissionResult = await checkUserPermission('ADMIN');
        
        if (!permissionResult.success) {
            return ServiceResult.error(permissionResult.error!);
        }

        if (!permissionResult.data) {
            return ServiceResult.error('Permission administrateur requise');
        }

        // Création de la ville
        const cityRepository = new CityApiRepository();
        const city = await cityRepository.create(sessionResult.accessToken!, cityData);

        return ServiceResult.success(city);
    } catch (error) {
        console.error('Erreur lors de la création de la ville:', error);
        
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'Erreur lors de la création de la ville';

        return ServiceResult.error(errorMessage);
    }
}

/**
 * Met à jour une ville (admin uniquement)
 */
export async function updateCity(
    id: number, 
    cityData: Partial<City>
): Promise<ServiceResult<City>> {
    try {
        // Vérification de l'authentification
        const sessionResult = await verifySession();
        
        if (!sessionResult.isAuthenticated) {
            return ServiceResult.error(
                sessionResult.error || 'Utilisateur non authentifié'
            );
        }

        // Vérification des permissions admin
        const permissionResult = await checkUserPermission('ADMIN');
        
        if (!permissionResult.success) {
            return ServiceResult.error(permissionResult.error!);
        }

        if (!permissionResult.data) {
            return ServiceResult.error('Permission administrateur requise');
        }

        // Mise à jour de la ville
        const cityRepository = new CityApiRepository();
        const city = await cityRepository.update(sessionResult.accessToken!, id, cityData);

        return ServiceResult.success(city);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la ville:', error);
        
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'Erreur lors de la mise à jour de la ville';

        return ServiceResult.error(errorMessage);
    }
}

/**
 * Supprime une ville (admin uniquement)
 */
export async function deleteCity(id: number): Promise<ServiceResult<boolean>> {
    try {
        // Vérification de l'authentification
        const sessionResult = await verifySession();
        
        if (!sessionResult.isAuthenticated) {
            return ServiceResult.error(
                sessionResult.error || 'Utilisateur non authentifié'
            );
        }

        // Vérification des permissions admin
        const permissionResult = await checkUserPermission('ADMIN');
        
        if (!permissionResult.success) {
            return ServiceResult.error(permissionResult.error!);
        }

        if (!permissionResult.data) {
            return ServiceResult.error('Permission administrateur requise');
        }

        // Suppression de la ville
        const cityRepository = new CityApiRepository();
        await cityRepository.delete(sessionResult.accessToken!, id);

        return ServiceResult.success(true);
    } catch (error) {
        console.error('Erreur lors de la suppression de la ville:', error);
        
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'Erreur lors de la suppression de la ville';

        return ServiceResult.error(errorMessage);
    }
}