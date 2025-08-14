"use client";

import { useState } from "react";
import { CitySelectorClean } from "./city-selector-clean";
import { Option } from "@/presentation/components/ui/multiselect";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";

/**
 * Composant de test pour valider CitySelectorClean
 * avec l'architecture Clean (/src) et TanStack Query
 */
export function CitySelectorTest() {
    const [selectedCities, setSelectedCities] = useState<Option[]>([]);

    const handleSelectionChange = (cities: Option[]) => {
        setSelectedCities(cities);
        console.log("Villes sélectionnées:", cities);
    };

    return (
        <div className="space-y-6 p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Test CitySelectorClean - Architecture /src</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Composant utilisant l'architecture Clean avec TanStack Query
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <CitySelectorClean
                        onSelectionChange={handleSelectionChange}
                        placeholder="Choisissez vos villes (perPage=100)"
                    />
                    
                    {selectedCities.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium">Villes sélectionnées :</h3>
                            <div className="mt-2 space-y-1">
                                {selectedCities.map((city) => (
                                    <div
                                        key={city.value}
                                        className="text-sm bg-muted px-2 py-1 rounded"
                                    >
                                        {city.label} (ID: {city.value})
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}