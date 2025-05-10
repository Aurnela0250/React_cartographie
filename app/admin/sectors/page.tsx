"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

import { Sector } from "@/core/domain/entities/sector.entity";
import {
    createSector,
    deleteSector,
    updateSector,
} from "@/infrastructure/server-action/sector.actions";
import { Button } from "@/presentation/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { SectorDeleteDialog } from "./components/SectorDeleteDialog";
import { SectorDialog } from "./components/SectorDialog";
import { SectorList } from "./components/SectorList";

export default function SectorPage() {
    const queryClient = useQueryClient();
    const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedSector, setSelectedSector] = React.useState<Sector | null>(
        null
    );
    const [deleteSectorData, setDeleteSectorData] =
        React.useState<Sector | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    type MutationError =
        | { statusCode?: number; name?: string; message?: string }
        | unknown;
    const createMutation = useMutation({
        mutationFn: createSector,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sectors"] });
            setIsAddEditDialogOpen(false);
            setFormError(null);
        },
        onError: (error: MutationError) => {
            if (
                typeof error === "object" &&
                error !== null &&
                "message" in error
            ) {
                setFormError(
                    (error as { message?: string }).message || "Erreur inconnue"
                );
            } else {
                setFormError("Erreur inconnue");
            }
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: { name?: string; city_id?: number };
        }) => updateSector(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sectors"] });
            setIsAddEditDialogOpen(false);
            setSelectedSector(null);
            setFormError(null);
        },
        onError: (error: MutationError) => {
            if (
                typeof error === "object" &&
                error !== null &&
                "message" in error
            ) {
                setFormError(
                    (error as { message?: string }).message ||
                        "Erreur lors de la modification du secteur."
                );
            } else {
                setFormError("Erreur lors de la modification du secteur.");
            }
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteSector(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sectors"] });
            setIsDeleteDialogOpen(false);
            setDeleteSectorData(null);
        },
    });

    const handleAdd = () => {
        setFormError(null);
        setSelectedSector(null);
        setIsAddEditDialogOpen(true);
    };

    const handleEdit = (sector: Sector) => {
        setFormError(null);
        setSelectedSector(sector);
        setIsAddEditDialogOpen(true);
    };

    const handleDelete = (sector: Sector) => {
        setFormError(null);
        setDeleteSectorData(sector);
        setIsDeleteDialogOpen(true);
    };

    const handleDialogSubmit = (data: { name: string; city_id: number }) => {
        setFormError(null);
        if (selectedSector?.id) {
            updateMutation.mutate({ id: selectedSector.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDeleteConfirm = () => {
        if (deleteSectorData?.id) {
            deleteMutation.mutate(deleteSectorData.id);
        }
    };

    return (
        <div className="container space-y-6 py-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">
                        Secteurs
                    </CardTitle>
                    <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={handleAdd}
                    >
                        <Plus className="mr-2 size-4" />
                        Ajouter un secteur
                    </Button>
                </CardHeader>
                <CardContent className="max-h-[60vh] overflow-auto">
                    <SectorList onDelete={handleDelete} onEdit={handleEdit} />
                </CardContent>
            </Card>

            <SectorDialog
                error={formError}
                initialData={selectedSector || undefined}
                open={isAddEditDialogOpen}
                onClose={() => setIsAddEditDialogOpen(false)}
                onSubmit={handleDialogSubmit}
            />

            <SectorDeleteDialog
                open={isDeleteDialogOpen}
                sectorName={deleteSectorData?.name || ""}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
