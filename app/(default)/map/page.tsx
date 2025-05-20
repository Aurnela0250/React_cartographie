"use client";

import { useState } from "react";

import { EstablishmentList } from "@/presentation/components/features/establishment-list";
import { MapExplorer } from "@/presentation/components/features/map/map-explorer";
import { SearchFilters } from "@/presentation/components/features/search-filters";
import type { FilterParams } from "@/presentation/components/features/search-filters";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/presentation/components/ui/tabs";

export default function MapPage() {
    const [filters, setFilters] = useState<FilterParams>({});

    return (
        <div className="flex h-full min-h-0 flex-col">
            <h1 className="mb-6 text-3xl font-bold">
                Carte des établissements
            </h1>

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Filtres</CardTitle>
                        <CardDescription>
                            Affinez votre recherche
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SearchFilters onFilterChange={setFilters} />
                    </CardContent>
                </Card>

                <div className="flex min-h-0 flex-col lg:col-span-2">
                    <Tabs
                        className="flex min-h-0 w-full flex-1 flex-col"
                        defaultValue="map"
                    >
                        <TabsList className="mb-4">
                            <TabsTrigger value="map">Carte</TabsTrigger>
                            <TabsTrigger value="list">Liste</TabsTrigger>
                        </TabsList>
                        <TabsContent
                            className="flex min-h-0 flex-1"
                            value="map"
                        >
                            <div className="min-h-0 w-full flex-1 overflow-hidden rounded-lg">
                                <MapExplorer filters={filters} />
                            </div>
                        </TabsContent>
                        <TabsContent
                            className="h-full overflow-auto"
                            value="list"
                        >
                            <EstablishmentList />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
