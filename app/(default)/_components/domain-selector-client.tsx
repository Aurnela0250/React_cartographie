"use client";

import { GraduationCap } from "lucide-react";

import { SelectorClient } from "./selector-client";
import { SelectorOption, useSelectorsStore } from "./selectors.store";

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
    const { selectedDomain, setSelectedDomain } = useSelectorsStore();

    return (
        <SelectorClient
            icon={
                <GraduationCap
                    size={16}
                    aria-hidden="true"
                    className="text-muted-foreground/80"
                />
            }
            placeholder="Sélectionner un domaine"
            options={availableDomains}
            value={selectedDomain?.value}
            onChangeAction={setSelectedDomain}
        />
    );
}
