import { EstablishmentInfo } from "./_components/establishment-info";

interface EstablishmentPageProps {
    params: Promise<{ id: string }>;
}

export default async function EstablishmentPage({ params }: EstablishmentPageProps) {
    const { id } = await params;
    const establishmentId = Number.parseInt(id, 10);

    if (!Number.isFinite(establishmentId)) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        ID d'établissement invalide
                    </h2>
                    <p className="text-muted-foreground">
                        L'identifiant fourni n'est pas valide.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <EstablishmentInfo establishmentId={establishmentId} />
        </div>
    );
}
