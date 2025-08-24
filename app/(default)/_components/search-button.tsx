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
    console.log("SearchButton Rendu");
    const { selectedCity, selectedDomain, selectedLevel } = useSelectorsStore();

    // Generate URL search parameters from selected options
    const generateSearchParams = () => {
        const params = new URLSearchParams();

        // Add city to params
        if (selectedCity) {
            const cityParam = `${selectedCity.value}:${encodeURIComponent(selectedCity.label)}`;
            params.set("cities", cityParam);
        }

        // Add domain to params
        if (selectedDomain) {
            const domainParam = `${selectedDomain.value}:${encodeURIComponent(selectedDomain.label)}`;
            params.set("domains", domainParam);
        }

        // Add level to params
        if (selectedLevel) {
            const levelParam = `${selectedLevel.value}:${encodeURIComponent(selectedLevel.label)}`;
            params.set("levels", levelParam);
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
        <Button asChild size="lg" className="w-full md:rounded-full lg:w-full">
            <Link href={establishmentsUrl}>
                <Search className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">Rechercher</span>
                <span className="sm:hidden">Rechercher des établissements</span>
            </Link>
        </Button>
    );
}
