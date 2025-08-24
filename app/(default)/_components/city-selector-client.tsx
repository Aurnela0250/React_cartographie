"use client";

import { MapPin } from "lucide-react";

import { SelectorClient } from "./selector-client";
import { SelectorOption, useSelectorsStore } from "./selectors.store";

interface CitySelectorClientProps {
    availableCities: SelectorOption[];
}

/**
 * Client wrapper for CitySelector that handles interactivity via Zustand store
 * Available cities come from server props, selected city managed by Zustand
 */
export function CitySelectorClient({
    availableCities,
}: CitySelectorClientProps) {
    const { selectedCity, setSelectedCity } = useSelectorsStore();

    return (
        <SelectorClient
            icon={
                <MapPin
                    size={16}
                    aria-hidden="true"
                    className="text-muted-foreground/80"
                />
            }
            placeholder="Sélectionner une ville"
            options={availableCities}
            value={selectedCity?.value}
            onChangeAction={setSelectedCity}
        />
    );
}
