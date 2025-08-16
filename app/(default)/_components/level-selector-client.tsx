"use client";

import {
    SelectorOption,
    useSelectorsStore,
} from "@/app/(default)/_components/selectors.store";
import { Label } from "@/presentation/components/ui/label";
import MultipleSelector from "@/presentation/components/ui/multiselect";

interface LevelSelectorClientProps {
    availableLevels: SelectorOption[];
}

/**
 * Client wrapper for LevelSelector that handles interactivity via Zustand store
 * Available levels come from server props, selected levels managed by Zustand
 */
export function LevelSelectorClient({
    availableLevels,
}: LevelSelectorClientProps) {
    const { selectedLevels, setSelectedLevels } = useSelectorsStore();

    return (
        <div className="space-y-2">
            <Label htmlFor="level-selector">Niveaux</Label>
            <MultipleSelector
                commandProps={{
                    label: "Sélectionner des niveaux",
                }}
                defaultOptions={availableLevels}
                value={selectedLevels}
                placeholder="Sélectionner des niveaux"
                emptyIndicator={
                    <p className="text-center text-sm">Aucun niveau trouvé</p>
                }
                onChange={setSelectedLevels}
            />
        </div>
    );
}
