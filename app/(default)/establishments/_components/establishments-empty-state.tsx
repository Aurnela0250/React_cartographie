import { Building } from "lucide-react";

export function EstablishmentsEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building className="size-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun établissement trouvé</h3>
            <p className="text-muted-foreground max-w-md">
                Aucun établissement ne correspond à vos critères de recherche. 
                Essayez de modifier vos filtres.
            </p>
        </div>
    );
}
