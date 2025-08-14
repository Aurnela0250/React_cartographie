"use client";

import { Label } from "@/presentation/components/ui/label";
import MultipleSelector, {
    Option,
} from "@/presentation/components/ui/multiselect";
import { useCitiesClean } from "@/presentation/hooks/use-cities-clean";

interface CitySelectorProps {
    onSelectionChange?: (cities: Option[]) => void;
    placeholder?: string;
    defaultValue?: Option[];
}

/**
 * City Selector component using Clean Architecture /src
 * Now a client component that uses TanStack Query for data fetching
 */
export function CitySelector({ 
    onSelectionChange, 
    placeholder = "Sélectionner des villes",
    defaultValue = []
}: CitySelectorProps) {
    const { citiesOptions, isLoading, isError, error } = useCitiesClean();

    if (isError) {
        return (
            <div className="space-y-2">
                <Label htmlFor="city-selector">Villes</Label>
                <div className="text-red-500 text-sm">
                    Erreur lors du chargement des villes: {error?.message}
                </div>
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
                placeholder={isLoading ? "Chargement..." : placeholder}
                emptyIndicator={
                    <p className="text-center text-sm">
                        {isLoading ? "Chargement..." : "Aucune ville trouvée"}
                    </p>
                }
                disabled={isLoading}
                onChange={onSelectionChange}
                value={defaultValue}
            />
        </div>
    );
}
