import { EstablishmentList } from "@/components/establishment-list"
import { SearchFilters } from "@/components/search-filters"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"

export default function EstablishmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Établissements</h1>
          <p className="text-muted-foreground">Découvrez tous les établissements d'enseignement supérieur</p>
        </div>
        <Button>Exporter les résultats</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres de recherche</CardTitle>
          <CardDescription>Affinez votre recherche selon vos critères</CardDescription>
        </CardHeader>
        <CardContent>
          <SearchFilters />
        </CardContent>
      </Card>

      <EstablishmentList />

      <div className="flex justify-center">
        <Pagination />
      </div>
    </div>
  )
}

