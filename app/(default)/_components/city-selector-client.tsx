"use client";

import {
    SelectorOption,
    useSelectorsStore,
} from "@/app/(default)/_components/selectors.store";
import { Label } from "@/presentation/components/ui/label";
import MultipleSelector from "@/presentation/components/ui/multiselect";

interface CitySelectorClientProps {
    availableCities: SelectorOption[];
}

/**
 * Client wrapper for CitySelector that handles interactivity via Zustand store
 * Available cities come from server props, selected cities managed by Zustand
 */
export function CitySelectorClient({
    availableCities,
}: CitySelectorClientProps) {
    const { selectedCities, setSelectedCities } = useSelectorsStore();

    return (
        <div className="space-y-2">
            <Label htmlFor="city-selector">Villes</Label>
            <MultipleSelector
                commandProps={{
                    label: "Sélectionner des villes",
                }}
                defaultOptions={availableCities}
                value={selectedCities}
                placeholder="Sélectionner des villes"
                emptyIndicator={
                    <p className="text-center text-sm">Aucune ville trouvée</p>
                }
                onChange={setSelectedCities}
            />
        </div>
    );
}
