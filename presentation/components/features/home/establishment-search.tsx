"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { IEstablishment } from "@/core/entities/establishment.entity";
import { PaginatedResult } from "@/core/entities/pagination";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { useDebounce } from "@/presentation/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";

type EstablishmentSearchResponse = PaginatedResult<IEstablishment>;

async function fetchEstablishments(
    name: string
): Promise<EstablishmentSearchResponse> {
    if (!name.trim()) {
        return {
            items: [],
            totalItems: 0,
            page: 1,
            perPage: 10,
            totalPages: 0,
        } as EstablishmentSearchResponse; // Cast to satisfy the type
    }
    const response = await fetch(
        `/api/establishments/filter?name=${encodeURIComponent(name)}`
    );

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    return response.json();
}

const scrollbarStyles = `
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
  }
`;

export function EstablishmentSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500); // Recherche automatique avec debounce

    const { data: establishmentsResponse, isLoading } = useQuery<
        EstablishmentSearchResponse,
        Error
    >({
        queryKey: ["establishments", debouncedSearchTerm],
        queryFn: () => fetchEstablishments(debouncedSearchTerm),
        enabled: !!debouncedSearchTerm, // Exécuter la requête uniquement si debouncedSearchTerm n'est pas vide
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const establishments = establishmentsResponse?.items;

    return (
        <div className="relative">
            <style global jsx>
                {scrollbarStyles}
            </style>
            <div className="flex items-center gap-2">
                <Input
                    className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
                    placeholder="Rechercher un établissement..."
                    value={searchTerm}
                    onChange={handleInputChange}
                />
                {/* Le bouton est conservé pour le design, mais la recherche est automatique */}
                <Button disabled={isLoading || !searchTerm} size="sm">
                    <Search className="mr-2 size-4" />
                    {isLoading ? "Recherche..." : "Rechercher"}
                </Button>
            </div>
            {debouncedSearchTerm &&
                establishments &&
                establishments.length > 0 && (
                    <ul className="scrollbar-thin absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-card shadow-lg">
                        {establishments.length > 5 && (
                            <li className="sticky top-0 border-b bg-muted/30 px-4 py-1 text-xs text-muted-foreground">
                                {establishments.length} résultats trouvés -
                                faites défiler pour voir plus
                            </li>
                        )}
                        {establishments.map((establishment) => (
                            <li
                                key={establishment.id}
                                className="border-b transition-colors last:border-b-0"
                            >
                                <Link
                                    className="block px-4 py-2 text-sm hover:bg-muted/50 focus:bg-muted/50 focus:outline-none"
                                    href={`/establishments/${establishment.id}`}
                                    tabIndex={0}
                                >
                                    {establishment.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            {debouncedSearchTerm &&
                !isLoading &&
                establishments &&
                establishments.length === 0 && (
                    <p className="absolute z-10 mt-1 w-full rounded-md border bg-card p-4 text-sm text-muted-foreground shadow-lg">
                        Aucun établissement trouvé.
                    </p>
                )}
        </div>
    );
}
