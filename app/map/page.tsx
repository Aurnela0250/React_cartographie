import { MapExplorer } from "@/components/map-explorer"
import { SearchFilters } from "@/components/search-filters"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EstablishmentList } from "@/components/establishment-list"

export default function MapPage() {
  return (
    <div className="h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Carte des établissements</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
            <CardDescription>Affinez votre recherche</CardDescription>
          </CardHeader>
          <CardContent>
            <SearchFilters />
          </CardContent>
        </Card>

        <div className="lg:col-span-2 flex flex-col">
          <Tabs defaultValue="map" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="map">Carte</TabsTrigger>
              <TabsTrigger value="list">Liste</TabsTrigger>
            </TabsList>
            <TabsContent value="map" className="flex-1">
              <div className="h-[calc(100vh-300px)] rounded-lg overflow-hidden">
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
  )
}

