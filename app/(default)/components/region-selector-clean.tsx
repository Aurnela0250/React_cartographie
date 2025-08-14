"use client";

import { Label } from "@/presentation/components/ui/label";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import MultipleSelector, {
    Option,
} from "@/presentation/components/ui/multiselect";
import { useRegions } from "@/presentation/hooks/use-regions";
import { Alert, AlertDescription } from "@/presentation/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface RegionSelectorProps {
    onSelectionChange?: (regions: Option[]) => void;
    placeholder?: string;
    defaultValue?: Option[];
    disabled?: boolean;
}

/**
 * Composant RegionSelector utilisant l'architecture Clean (/src)
 * avec TanStack Query pour le cache et la gestion des états
 */
export function RegionSelectorClean({
    onSelectionChange,
    placeholder = "Sélectionner des régions",
    defaultValue = [],
    disabled = false,
}: RegionSelectorProps) {
    const { regionsOptions, isLoading, error } = useRegions();

    // État de chargement
    if (isLoading) {
        return (
            <div className="space-y-2">
                <Label htmlFor="region-selector">Régions</Label>
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    // État d'erreur
    if (error) {
        return (
            <div className="space-y-2">
                <Label htmlFor="region-selector">Régions</Label>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Erreur lors du chargement des régions:{" "}
                        {error instanceof Error ? error.message : "Erreur inconnue"}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <Label htmlFor="region-selector">Régions</Label>
            <MultipleSelector
                commandProps={{
                    label: "Sélectionner des régions",
                }}
                defaultOptions={regionsOptions}
                placeholder={placeholder}
                emptyIndicator={
                    <p className="text-center text-sm">Aucune région trouvée</p>
                }
                onChange={onSelectionChange}
                disabled={disabled}
            />
        </div>
    );
}