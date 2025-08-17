"use client";

import Link from "next/link";
import { Search } from "lucide-react";

import { useSelectorsStore } from "@/app/(default)/_components/selectors.store";
import { Button } from "@/presentation/components/ui/button";

/**
 * Search button component that generates establishments URL with selected filters
 * Uses Zustand store to build query parameters dynamically
 */
export function SearchButton() {
    const { selectedCities, selectedDomains, selectedLevels } =
        useSelectorsStore();

    // Generate URL search parameters from selected options
    const generateSearchParams = () => {
        const params = new URLSearchParams();

        // Add cities to params
        if (selectedCities.length > 0) {
            const citiesParam = selectedCities
                .map(
                    (city) => `${city.value}:${encodeURIComponent(city.label)}`
                )
                .join(",");
            params.set("cities", citiesParam);
        }

        // Add domains to params
        if (selectedDomains.length > 0) {
            const domainsParam = selectedDomains
                .map(
                    (domain) =>
                        `${domain.value}:${encodeURIComponent(domain.label)}`
                )
                .join(",");
            params.set("domains", domainsParam);
        }

        // Add levels to params
        if (selectedLevels.length > 0) {
            const levelsParam = selectedLevels
                .map(
                    (level) =>
                        `${level.value}:${encodeURIComponent(level.label)}`
                )
                .join(",");
            params.set("levels", levelsParam);
        }

        // Always include pagination defaults
        // Starts from first page and uses default page size expected by establishments page
        params.set("page", "1");
        params.set("perPage", "12");

        return params.toString();
    };

    const searchParams = generateSearchParams();
    const establishmentsUrl = `/establishments${searchParams ? `?${searchParams}` : ""}`;

    return (
        <Button asChild size="lg" className="w-full lg:w-full">
            <Link href={establishmentsUrl}>
                <Search className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">Rechercher</span>
                <span className="sm:hidden">Rechercher des établissements</span>
            </Link>
        </Button>
    );
}
