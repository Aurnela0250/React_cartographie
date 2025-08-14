"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

// Option type for MultipleSelector component
export type CityOption = {
    value: string;
    label: string;
};

/**
 * Hook pour récupérer les villes via l'architecture Clean (/src)
 * avec TanStack Query pour le cache et la gestion des états
 */
export function useCitiesClean() {
    const { isAuthenticated } = useAuth();
    
    const {
        data: citiesResponse,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["cities", "clean-architecture"],
        queryFn: async () => {
            // Utilisation de l'API route Next.js qui gère l'authentification
            const response = await fetch('/api/cities?per_page=100&page=1');
            
            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status}`);
            }
            
            const result = await response.json();
            return result;
        },
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (anciennement cacheTime)
        retry: 2,
        refetchOnWindowFocus: false,
    });

    // Transformation en options pour MultipleSelector
    const citiesOptions: CityOption[] =
        citiesResponse?.items?.map((city) => ({
            value: city.id?.toString() || "",
            label: city.name || "",
        })) || [];

    return {
        // Données brutes
        cities: citiesResponse?.items || [],
        citiesResponse,
        
        // Options pour MultipleSelector
        citiesOptions,
        
        // États de chargement
        isLoading,
        error,
        
        // Actions
        refetch,
        
        // Métadonnées
        totalItems: citiesResponse?.totalItems || 0,
        totalPages: citiesResponse?.totalPages || 0,
        currentPage: citiesResponse?.page || 1,
    };
}