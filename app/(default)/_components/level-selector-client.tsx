"use client";

import { Trophy } from "lucide-react";

import { SelectorClient } from "./selector-client";
import { SelectorOption, useSelectorsStore } from "./selectors.store";

interface LevelSelectorClientProps {
    availableLevels: SelectorOption[];
}

/**
 * Client wrapper for LevelSelector that handles interactivity via Zustand store
 * Available levels come from server props, selected level managed by Zustand
 */
export function LevelSelectorClient({
    availableLevels,
}: LevelSelectorClientProps) {
    const { selectedLevel, setSelectedLevel } = useSelectorsStore();

    return (
        <SelectorClient
            icon={
                <Trophy
                    size={16}
                    aria-hidden="true"
                    className="text-muted-foreground/80"
                />
            }
            placeholder="Sélectionner un niveau"
            options={availableLevels}
            value={selectedLevel?.value}
            onChangeAction={setSelectedLevel}
        />
    );
}
