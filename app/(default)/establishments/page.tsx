import { EstablishmentList } from "@/presentation/components/features/establishment-list";
import { SearchFilters } from "@/presentation/components/features/search-filters";
import { Button } from "@/presentation/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";
import { Pagination } from "@/presentation/components/ui/pagination";

export default async function EstablishmentsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold">Établissements</h1>
                    <p className="text-muted-foreground">
                        Découvrez tous les établissements d'enseignement
                        supérieur
                    </p>
                </div>
                <Button>Exporter les résultats</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filtres de recherche</CardTitle>
                    <CardDescription>
                        Affinez votre recherche selon vos critères
                    </CardDescription>
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
    );
}
