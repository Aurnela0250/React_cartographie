import { Label } from "@/presentation/components/ui/label";

interface CitySelectorErrorProps {
    error: string;
}

/**
 * Composant d'erreur pour le CitySelector
 * Affiche les erreurs de chargement des villes
 */
export function CitySelectorError({ error }: CitySelectorErrorProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="city-selector-error">Villes</Label>
            <div className="text-sm text-red-500">
                Erreur lors du chargement des villes: {error}
            </div>
        </div>
    );
}