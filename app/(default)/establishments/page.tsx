import { EstablishmentList } from "@/presentation/components/features/establishments/establishment-list";

export default async function EstablishmentsPage() {
    return (
        <div className="min-h-0 space-y-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold">Établissements</h1>
                    <p className="text-muted-foreground">
                        Découvrez tous les établissements d'enseignement
                        supérieur
                    </p>
                </div>
            </div>

            <EstablishmentList />
        </div>
    );
}
