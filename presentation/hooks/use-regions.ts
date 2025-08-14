"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

// Option type for MultipleSelector component
export type RegionOption = {
    value: string;
    label: string;
};

/**
 * Hook pour récupérer les régions via l'architecture Clean (/src)
 * avec TanStack Query pour le cache et la gestion des états
 */
export function useRegions() {
    const { isAuthenticated } = useAuth();
    
    const {
        data: regionsResponse,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["regions", "clean-architecture"],
        queryFn: async () => {
            // Utilisation de l'API route Next.js qui gère l'authentification
            const response = await fetch('/api/regions?per_page=100&page=1');
            
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
    const regionsOptions: RegionOption[] =
        regionsResponse?.items?.map((region: any) => ({
            value: region.id?.toString() || "",
            label: region.name || "",
        })) || [];

    return {
        // Données brutes
        regions: regionsResponse?.items || [],
        regionsResponse,
        
        // Options pour MultipleSelector
        regionsOptions,
        
        // États de chargement
        isLoading,
        error,
        
        // Actions
        refetch,
        
        // Métadonnées
        totalItems: regionsResponse?.totalItems || 0,
        totalPages: regionsResponse?.totalPages || 0,
        currentPage: regionsResponse?.page || 1,
    };
}