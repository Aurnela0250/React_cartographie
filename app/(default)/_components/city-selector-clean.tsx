"use client";

import { Label } from "@/presentation/components/ui/label";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import MultipleSelector, {
    Option,
} from "@/presentation/components/ui/multiselect";
import { useCitiesClean } from "@/presentation/hooks/use-cities-clean";
import { Alert, AlertDescription } from "@/presentation/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CitySelectorProps {
    onSelectionChange?: (cities: Option[]) => void;
    placeholder?: string;
    defaultValue?: Option[];
    disabled?: boolean;
}

/**
 * Composant CitySelector utilisant l'architecture Clean (/src)
 * avec TanStack Query pour le cache et la gestion des états
 */
export function CitySelectorClean({
    onSelectionChange,
    placeholder = "Sélectionner des villes",
    defaultValue = [],
    disabled = false,
}: CitySelectorProps) {
    const { citiesOptions, isLoading, error } = useCitiesClean();

    // État de chargement
    if (isLoading) {
        return (
            <div className="space-y-2">
                <Label htmlFor="city-selector">Villes</Label>
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    // État d'erreur
    if (error) {
        return (
            <div className="space-y-2">
                <Label htmlFor="city-selector">Villes</Label>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Erreur lors du chargement des villes:{" "}
                        {error instanceof Error ? error.message : "Erreur inconnue"}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <Label htmlFor="city-selector">Villes</Label>
            <MultipleSelector
                commandProps={{
                    label: "Sélectionner des villes",
                }}
                defaultOptions={citiesOptions}
                placeholder={placeholder}
                emptyIndicator={
                    <p className="text-center text-sm">Aucune ville trouvée</p>
                }
                onChange={onSelectionChange}
                defaultValue={defaultValue}
                disabled={disabled}
            />
        </div>
    );
}