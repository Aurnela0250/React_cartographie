import { EstablishmentList } from "@/presentation/components/features/establishment-list";
import { MapExplorer } from "@/presentation/components/features/map-explorer";
import { SearchFilters } from "@/presentation/components/features/search-filters";
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
    return (
        <div className="flex h-full flex-col">
            <h1 className="mb-6 text-3xl font-bold">
                Carte des établissements
            </h1>

            <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Filtres</CardTitle>
                        <CardDescription>
                            Affinez votre recherche
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SearchFilters />
                    </CardContent>
                </Card>

                <div className="flex flex-col lg:col-span-2">
                    <Tabs className="w-full" defaultValue="map">
                        <TabsList className="mb-4">
                            <TabsTrigger value="map">Carte</TabsTrigger>
                            <TabsTrigger value="list">Liste</TabsTrigger>
                        </TabsList>
                        <TabsContent className="flex-1" value="map">
                            <div className="h-[calc(100vh-300px)] overflow-hidden rounded-lg">
                                <MapExplorer />
                            </div>
                        </TabsContent>
                        <TabsContent value="list">
                            <EstablishmentList />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
