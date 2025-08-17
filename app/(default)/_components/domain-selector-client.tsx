"use client";

import {
    SelectorOption,
    useSelectorsStore,
} from "@/app/(default)/_components/selectors.store";
import { Label } from "@/presentation/components/ui/label";
import MultipleSelector from "@/presentation/components/ui/multiselect";

interface DomainSelectorClientProps {
    availableDomains: SelectorOption[];
}

/**
 * Client wrapper for DomainSelector that handles interactivity via Zustand store
 * Available domains come from server props, selected domains managed by Zustand
 */
export function DomainSelectorClient({
    availableDomains,
}: DomainSelectorClientProps) {
    const { selectedDomains, setSelectedDomains } = useSelectorsStore();

    return (
        <div className="space-y-2">
            <Label htmlFor="domain-selector">Domaines d'études</Label>
            <MultipleSelector
                commandProps={{
                    label: "Sélectionner des domaines",
                }}
                defaultOptions={availableDomains}
                value={selectedDomains}
                placeholder="Sélectionner des domaines"
                emptyIndicator={
                    <p className="text-center text-sm">Aucun domaine trouvé</p>
                }
                onChange={setSelectedDomains}
            />
        </div>
    );
}
