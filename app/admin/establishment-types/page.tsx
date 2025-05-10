"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

import { EstablishmentType } from "@/core/domain/entities/establishment-type.entity";
import {
    createEstablishmentType,
    deleteEstablishmentType,
    updateEstablishmentType,
} from "@/infrastructure/server-action/establishment-type.actions";
import { Button } from "@/presentation/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { EstablishmentTypeDeleteDialog } from "./components/EstablishmentTypeDeleteDialog";
import { EstablishmentTypeDialog } from "./components/EstablishmentTypeDialog";
import { EstablishmentTypeList } from "./components/EstablishmentTypeList";

export default function EstablishmentTypePage() {
    const queryClient = useQueryClient();
    const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedEstablishmentType, setSelectedEstablishmentType] =
        React.useState<EstablishmentType | null>(null);
    const [deleteEstablishmentTypeData, setDeleteEstablishmentTypeData] =
        React.useState<EstablishmentType | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    type MutationError =
        | { statusCode?: number; name?: string; message?: string }
        | unknown;
    const createMutation = useMutation({
        mutationFn: createEstablishmentType,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["establishment-types"],
            });
            setIsAddEditDialogOpen(false);
            setFormError(null);
        },
        onError: (error: MutationError) => {
            if (
                typeof error === "object" &&
                error !== null &&
                ("statusCode" in error || "name" in error)
            ) {
                const err = error as {
                    statusCode?: number;
                    name?: string;
                    message?: string;
                };

                if (err.statusCode === 409 || err.name === "ConflictError") {
                    setFormError(err.message || "Ce type existe déjà.");

                    return;
                }
            }
            setFormError("Erreur lors de la création du type d'établissement.");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: { name?: string; description?: string };
        }) => updateEstablishmentType(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["establishment-types"],
            });
            setIsAddEditDialogOpen(false);
            setSelectedEstablishmentType(null);
            setFormError(null);
        },
        onError: (error: MutationError) => {
            if (
                typeof error === "object" &&
                error !== null &&
                ("statusCode" in error || "name" in error)
            ) {
                const err = error as {
                    statusCode?: number;
                    name?: string;
                    message?: string;
                };

                if (err.statusCode === 409 || err.name === "ConflictError") {
                    setFormError(err.message || "Ce type existe déjà.");

                    return;
                }
            }
            setFormError(
                "Erreur lors de la modification du type d'établissement."
            );
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteEstablishmentType(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["establishment-types"],
            });
            setIsDeleteDialogOpen(false);
            setDeleteEstablishmentTypeData(null);
        },
    });

    const handleAdd = () => {
        setFormError(null);
        setSelectedEstablishmentType(null);
        setIsAddEditDialogOpen(true);
    };

    const handleEdit = (establishmentType: EstablishmentType) => {
        setFormError(null);
        setSelectedEstablishmentType(establishmentType);
        setIsAddEditDialogOpen(true);
    };

    const handleDelete = (establishmentType: EstablishmentType) => {
        setFormError(null);
        setDeleteEstablishmentTypeData(establishmentType);
        setIsDeleteDialogOpen(true);
    };

    const handleDialogSubmit = (data: {
        name: string;
        description?: string | null;
    }) => {
        setFormError(null);
        // On retire explicitement le null pour description (API attend string | undefined)
        const cleanData = {
            ...data,
            description: data.description ?? undefined,
        };

        if (selectedEstablishmentType?.id) {
            updateMutation.mutate({
                id: selectedEstablishmentType.id,
                data: cleanData,
            });
        } else {
            createMutation.mutate(cleanData);
        }
    };

    const handleDeleteConfirm = () => {
        if (deleteEstablishmentTypeData?.id) {
            deleteMutation.mutate(deleteEstablishmentTypeData.id);
        }
    };

    return (
        <div className="container space-y-6 py-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">
                        Types d'établissement
                    </CardTitle>
                    <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={handleAdd}
                    >
                        <Plus className="mr-2 size-4" /> Ajouter un type
                    </Button>
                </CardHeader>
                <CardContent className="max-h-[60vh] overflow-auto">
                    <EstablishmentTypeList
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                </CardContent>
            </Card>

            <EstablishmentTypeDialog
                error={formError}
                initialData={selectedEstablishmentType || undefined}
                open={isAddEditDialogOpen}
                onClose={() => setIsAddEditDialogOpen(false)}
                onSubmit={handleDialogSubmit}
            />

            <EstablishmentTypeDeleteDialog
                establishmentTypeName={deleteEstablishmentTypeData?.name || ""}
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
