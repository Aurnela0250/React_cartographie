"use client";

import { Edit, ShieldCheck, Trash } from "lucide-react";

import type { Formation } from "@/core/entities/formation.entity";
import { Button } from "@/presentation/components/ui/button";
import { fetchWithAutoRefresh } from "@/shared/utils/fetch-with-refresh";
import { useQuery } from "@tanstack/react-query";

import { FormationListSkeleton } from "./formation-list-skeleton";
import { useFormationStore } from "./formation-store";

async function fetchFormations(establishmentId: string): Promise<Formation[]> {
    const res = await fetchWithAutoRefresh(
        `/api/formations/filter?establishmentId=${establishmentId}`
    );
    if (!res.ok) {
        throw new Error("Failed to fetch formations");
    }
    const data = await res.json();

    return data.items || [];
}

interface FormationsListProps {
    establishmentId: string;
}

export function FormationsList({ establishmentId }: FormationsListProps) {
    const {
        data: formations,
        isLoading,
        isError,
    } = useQuery<Formation[]>({
        queryKey: ["formations", establishmentId],
        queryFn: () => fetchFormations(establishmentId),
    });

    const {
        setSelectedFormation,
        setIsAddEditDialogOpen,
        setIsDeleteDialogOpen,
        setIsAuthorizationDialogOpen,
    } = useFormationStore();

    const handleEdit = (formation: Formation) => {
        setSelectedFormation(formation);
        setIsAddEditDialogOpen(true);
    };

    const handleDelete = (formation: Formation) => {
        setSelectedFormation(formation);
        setIsDeleteDialogOpen(true);
    };

    const handleAuthorization = (formation: Formation) => {
        setSelectedFormation(formation);
        setIsAuthorizationDialogOpen(true);
    };

    if (isLoading) {
        return <FormationListSkeleton />;
    }

    if (isError) {
        return <div>Erreur lors du chargement des formations.</div>;
    }

    return (
        <div className="space-y-4">
            {formations && formations.length > 0 ? (
                formations.map((formation) => (
                    <div
                        key={formation.id}
                        className="flex flex-col gap-2 rounded border bg-white p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {formation.name}
                                </h3>
                                <p className="mb-2 text-sm text-muted-foreground">
                                    {formation.description ||
                                        "Pas de description."}
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    <span>
                                        Durée : {formation.duration} mois
                                    </span>
                                    {formation.level?.name && (
                                        <span>
                                            Niveau : {formation.level.name}
                                        </span>
                                    )}
                                    {formation.mention?.name && (
                                        <span>
                                            Mention : {formation.mention.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    aria-label="Gérer l'autorisation"
                                    size="icon"
                                    variant="outline"
                                    onClick={() =>
                                        handleAuthorization(formation)
                                    }
                                >
                                    <ShieldCheck className="size-4" />
                                </Button>
                                <Button
                                    aria-label="Modifier"
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleEdit(formation)}
                                >
                                    <Edit className="size-4" />
                                </Button>
                                <Button
                                    aria-label="Supprimer"
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => handleDelete(formation)}
                                >
                                    <Trash className="size-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="mt-2 text-sm">
                            <p>
                                <span className="font-semibold">
                                    Autorisation :
                                </span>{" "}
                                {formation.authorization ? (
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs ${
                                            formation.authorization.status ===
                                            "VALIDATED"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {formation.authorization.status} (
                                        {formation.authorization.dateDebut} -{" "}
                                        {formation.authorization.dateFin ??
                                            "N/A"}
                                        )
                                    </span>
                                ) : (
                                    "Aucune"
                                )}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div>Aucune formation trouvée.</div>
            )}
        </div>
    );
}
