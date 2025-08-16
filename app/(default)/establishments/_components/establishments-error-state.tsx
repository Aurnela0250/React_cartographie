import { Building } from "lucide-react";

export function EstablishmentsErrorState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building className="size-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
            <p className="text-muted-foreground max-w-md">
                Une erreur est survenue lors du chargement des établissements. 
                Veuillez réessayer plus tard.
            </p>
        </div>
    );
}
