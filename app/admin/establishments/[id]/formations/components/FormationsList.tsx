"use client";

import React, { useState } from "react";
import { Edit, Plus, Trash } from "lucide-react";

import { IAnnualHeadcount } from "@/core/entities/annual-headcount.entity";
import { IFormation } from "@/core/entities/formation.entity";
import {
    createAnnualHeadcount,
    createFormation,
    deleteAnnualHeadcount,
    deleteFormation,
    updateAnnualHeadcount,
    updateFormation,
} from "@/infrastructure/server-actions/formation.actions";
import { Button } from "@/presentation/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AnnualHeadcountDeleteDialog } from "./AnnualHeadcountDeleteDialog";
import { AnnualHeadcountDialog } from "./AnnualHeadcountDialog";
import { FormationsDeleteDialog } from "./FormationsDeleteDialog";
import { FormationsDialog } from "./FormationsDialog";

interface FormationsListProps {
    formations: IFormation[];
    establishmentId: number;
    levels?: { id: number; name: string }[];
    mentions?: { id: number; name: string }[];
}

export function FormationsList({
    formations,
    establishmentId,
    levels = [],
    mentions = [],
}: FormationsListProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedFormation, setSelectedFormation] =
        useState<IFormation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    // State pour annual headcount
    const [ahDialogOpen, setAhDialogOpen] = useState(false);
    const [ahDeleteDialogOpen, setAhDeleteDialogOpen] = useState(false);
    const [selectedFormationForAh, setSelectedFormationForAh] =
        useState<IFormation | null>(null);
    const [selectedAnnualHeadcount, setSelectedAnnualHeadcount] =
        useState<IAnnualHeadcount | null>(null);
    const [ahError, setAhError] = useState<string | null>(null);

    // Mutations pour annual headcount
    type AnnualHeadcountFormData = { academicYear: number; students: number };
    const createAhMutation = useMutation<
        unknown,
        { message?: string },
        AnnualHeadcountFormData
    >({
        mutationFn: async (data) => {
            if (!selectedFormationForAh?.id)
                throw new Error("Aucune formation sélectionnée");

            return createAnnualHeadcount(selectedFormationForAh.id, data);
        },
        onSuccess: () => {
            setAhDialogOpen(false);
            setSelectedAnnualHeadcount(null);
            setSelectedFormationForAh(null);
            queryClient.invalidateQueries({ queryKey: ["establishment"] });
        },
        onError: (err) =>
            setAhError(
                err.message || "Erreur lors de la création de l'effectif annuel"
            ),
    });
    const updateAhMutation = useMutation<
        unknown,
        { message?: string },
        AnnualHeadcountFormData
    >({
        mutationFn: async (data) => {
            if (!selectedFormationForAh?.id || !selectedAnnualHeadcount?.id)
                throw new Error("Aucune formation ou effectif sélectionné");

            return updateAnnualHeadcount(
                selectedFormationForAh.id,
                selectedAnnualHeadcount.id,
                data
            );
        },
        onSuccess: () => {
            setAhDialogOpen(false);
            setSelectedAnnualHeadcount(null);
            setSelectedFormationForAh(null);
            queryClient.invalidateQueries({ queryKey: ["establishment"] });
        },
        onError: (err) =>
            setAhError(
                err.message ||
                    "Erreur lors de la modification de l'effectif annuel"
            ),
    });
    const deleteAhMutation = useMutation<boolean, { message?: string }, void>({
        mutationFn: async () => {
            if (!selectedFormationForAh?.id || !selectedAnnualHeadcount?.id)
                throw new Error("Aucune formation ou effectif sélectionné");

            return deleteAnnualHeadcount(
                selectedFormationForAh.id,
                selectedAnnualHeadcount.id
            );
        },
        onSuccess: () => {
            setAhDeleteDialogOpen(false);
            setSelectedAnnualHeadcount(null);
            setSelectedFormationForAh(null);
            queryClient.invalidateQueries({ queryKey: ["establishment"] });
        },
        onError: (err) =>
            setAhError(
                err.message ||
                    "Erreur lors de la suppression de l'effectif annuel"
            ),
    });

    // Mutations
    type FormationFormData = {
        intitule: string;
        description?: string;
        duration: number;
        levelId: number;
        mentionId: number;
        authorizationId?: number;
    };
    type MutationError = { message?: string };

    const createMutation = useMutation<
        unknown,
        MutationError,
        FormationFormData
    >({
        mutationFn: async (data: FormationFormData) =>
            createFormation({ ...data, establishmentId }),
        onSuccess: () => {
            setDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ["establishment"] });
        },
        onError: (err) => setError(err.message || "Erreur lors de la création"),
    });
    const updateMutation = useMutation<
        unknown,
        MutationError,
        FormationFormData
    >({
        mutationFn: async (data: FormationFormData) => {
            if (!selectedFormation?.id)
                throw new Error("Aucune formation sélectionnée");

            return updateFormation(selectedFormation.id, data);
        },
        onSuccess: () => {
            setDialogOpen(false);
            setSelectedFormation(null);
            queryClient.invalidateQueries({ queryKey: ["establishment"] });
        },
        onError: (err) =>
            setError(err.message || "Erreur lors de la modification"),
    });
    const deleteMutation = useMutation<unknown, MutationError, void>({
        mutationFn: async () => {
            if (!selectedFormation?.id)
                throw new Error("Aucune formation sélectionnée");

            return deleteFormation(selectedFormation.id);
        },
        onSuccess: () => {
            setDeleteDialogOpen(false);
            setSelectedFormation(null);
            queryClient.invalidateQueries({ queryKey: ["establishment"] });
        },
        onError: (err) =>
            setError(err.message || "Erreur lors de la suppression"),
    });

    const handleAdd = () => {
        setSelectedFormation(null);
        setDialogOpen(true);
        setError(null);
    };
    const handleEdit = (formation: IFormation) => {
        setSelectedFormation(formation);
        setDialogOpen(true);
        setError(null);
    };
    const handleDelete = (formation: IFormation) => {
        setSelectedFormation(formation);
        setDeleteDialogOpen(true);
        setError(null);
    };

    const handleDialogSubmit = (data: FormationFormData) => {
        if (selectedFormation) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDeleteConfirm = () => {
        deleteMutation.mutate();
    };

    return (
        <div className="space-y-4">
            <div className="mb-4 flex justify-end">
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 size-4" /> Ajouter une formation
                </Button>
            </div>
            {formations && formations.length > 0 ? (
                formations.map((formation) => (
                    <div
                        key={formation.id}
                        className="flex flex-col gap-2 rounded border bg-white p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {formation.intitule}
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
                        {/* Effectifs annuels */}
                        <div className="mt-2 border-t pt-2">
                            <div className="mb-1 flex items-center justify-between">
                                <span className="text-sm font-semibold">
                                    Effectifs annuels
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedFormationForAh(formation);
                                        setSelectedAnnualHeadcount(null);
                                        setAhDialogOpen(true);
                                        setAhError(null);
                                    }}
                                >
                                    <Plus className="mr-1 size-3" /> Ajouter
                                </Button>
                            </div>
                            {formation.annualHeadcounts &&
                            formation.annualHeadcounts.length > 0 ? (
                                <div className="space-y-1">
                                    {formation.annualHeadcounts.map((ah) => (
                                        <div
                                            key={ah.id}
                                            className="flex items-center justify-between rounded bg-gray-50 px-2 py-1 text-xs"
                                        >
                                            <span>
                                                Année :{" "}
                                                {ah.academicYear != null
                                                    ? `${ah.academicYear}-${ah.academicYear + 1}`
                                                    : "Année inconnue"}{" "}
                                                — Étudiants : {ah.students}
                                            </span>
                                            <span className="flex gap-1">
                                                <Button
                                                    aria-label="Modifier effectif"
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedFormationForAh(
                                                            formation
                                                        );
                                                        setSelectedAnnualHeadcount(
                                                            ah
                                                        );
                                                        setAhDialogOpen(true);
                                                        setAhError(null);
                                                    }}
                                                >
                                                    <Edit className="size-3" />
                                                </Button>
                                                <Button
                                                    aria-label="Supprimer effectif"
                                                    size="icon"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        setSelectedFormationForAh(
                                                            formation
                                                        );
                                                        setSelectedAnnualHeadcount(
                                                            ah
                                                        );
                                                        setAhDeleteDialogOpen(
                                                            true
                                                        );
                                                        setAhError(null);
                                                    }}
                                                >
                                                    <Trash className="size-3" />
                                                </Button>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-xs text-muted-foreground">
                                    Aucun effectif annuel.
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div>Aucune formation trouvée.</div>
            )}
            {/* Dialogues pour effectif annuel */}
            <AnnualHeadcountDialog
                error={ahError}
                initialData={
                    selectedAnnualHeadcount
                        ? {
                              academicYear:
                                  selectedAnnualHeadcount.academicYear ??
                                  new Date().getFullYear(),
                              students: selectedAnnualHeadcount.students ?? 0,
                          }
                        : undefined
                }
                open={ahDialogOpen}
                onClose={() => {
                    setAhDialogOpen(false);
                    setSelectedAnnualHeadcount(null);
                    setSelectedFormationForAh(null);
                }}
                onSubmit={(data) => {
                    if (selectedAnnualHeadcount) {
                        updateAhMutation.mutate(data);
                    } else {
                        createAhMutation.mutate(data);
                    }
                }}
            />
            <AnnualHeadcountDeleteDialog
                academicYear={selectedAnnualHeadcount?.academicYear ?? 0}
                open={ahDeleteDialogOpen}
                onClose={() => {
                    setAhDeleteDialogOpen(false);
                    setSelectedAnnualHeadcount(null);
                    setSelectedFormationForAh(null);
                }}
                onConfirm={() => deleteAhMutation.mutate()}
            />
            <FormationsDialog
                error={error}
                initialData={
                    selectedFormation
                        ? {
                              intitule: selectedFormation.intitule || "",
                              description: selectedFormation.description || "",
                              duration: selectedFormation.duration || 1,
                              levelId: selectedFormation.levelId || undefined,
                              mentionId:
                                  selectedFormation.mentionId || undefined,
                              authorizationId:
                                  selectedFormation.authorizationId ||
                                  undefined,
                          }
                        : undefined
                }
                levels={levels}
                mentions={mentions}
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setSelectedFormation(null);
                }}
                onSubmit={handleDialogSubmit}
            />
            <FormationsDeleteDialog
                formationIntitule={selectedFormation?.intitule || ""}
                open={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setSelectedFormation(null);
                }}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
