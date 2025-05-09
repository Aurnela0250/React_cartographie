"use client";

import React, { useState } from "react"; // Ajout de l'import useState
import { Plus } from "lucide-react";

import { Region } from "@/core/domain/entities/region.entity";
import {
    createRegion,
    deleteRegion,
    updateRegion,
} from "@/infrastructure/server-action/region.actions";
import { Button } from "@/presentation/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { RegionDeleteDialog } from "./components/RegionDeleteDialog";
import { RegionDialog } from "./components/RegionDialog";
import { RegionList } from "./components/RegionList";

export default function RegionPage() {
    const queryClient = useQueryClient();
    const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedRegion, setSelectedRegion] = React.useState<Region | null>(
        null
    );
    const [deleteRegionData, setDeleteRegionData] =
        React.useState<Region | null>(null);

    const [formError, setFormError] = useState<string | null>(null);

    type MutationError =
        | { statusCode?: number; name?: string; message?: string }
        | unknown;
    const createMutation = useMutation({
        mutationFn: createRegion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["regions"] });
            setIsAddEditDialogOpen(false); // Assure la fermeture du dialogue après création
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
                    setFormError(err.message || "Cette région existe déjà.");

                    return;
                }
            }
            setFormError("Erreur lors de la création de la région.");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: { name?: string; code?: string };
        }) => updateRegion(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["regions"] });
            setIsAddEditDialogOpen(false);
            setSelectedRegion(null);
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
                    setFormError(err.message || "Cette région existe déjà.");

                    return;
                }
            }
            setFormError("Erreur lors de la modification de la région.");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteRegion(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["regions"] });
            setIsDeleteDialogOpen(false); // Assure la fermeture du dialogue après suppression
            setDeleteRegionData(null);
        },
    });

    const handleAdd = () => {
        setFormError(null);
        setSelectedRegion(null);
        setIsAddEditDialogOpen(true);
    };

    const handleEdit = (region: Region) => {
        setFormError(null);
        setSelectedRegion(region);
        setIsAddEditDialogOpen(true);
    };

    const handleDelete = (region: Region) => {
        setFormError(null);
        setDeleteRegionData(region);
        setIsDeleteDialogOpen(true);
    };

    const handleDialogSubmit = (data: { name: string; code?: string }) => {
        setFormError(null);
        if (selectedRegion?.id) {
            updateMutation.mutate({ id: selectedRegion.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDeleteConfirm = () => {
        if (deleteRegionData?.id) {
            deleteMutation.mutate(deleteRegionData.id);
        }
    };

    return (
        <div className="container space-y-6 py-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">
                        Régions
                    </CardTitle>
                    <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={handleAdd}
                    >
                        <Plus className="mr-2 size-4" />
                        Ajouter une région
                    </Button>
                </CardHeader>
                <CardContent className="max-h-[60vh] overflow-auto">
                    <RegionList onDelete={handleDelete} onEdit={handleEdit} />
                </CardContent>
            </Card>

            <RegionDialog
                error={formError}
                initialData={selectedRegion || undefined}
                open={isAddEditDialogOpen}
                onClose={() => setIsAddEditDialogOpen(false)}
                onSubmit={handleDialogSubmit}
            />

            <RegionDeleteDialog
                open={isDeleteDialogOpen}
                regionName={deleteRegionData?.name || ""}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
