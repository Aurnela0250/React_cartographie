"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

import { Level } from "@/core/entities/level.entity";
import {
    createLevel,
    deleteLevel,
    updateLevel,
} from "@/infrastructure/server-actions/level.actions";
import { Button } from "@/presentation/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { LevelDeleteDialog } from "./components/LevelDeleteDialog";
import { LevelDialog } from "./components/LevelDialog";
import { LevelList } from "./components/LevelList";

export default function LevelPage() {
    const queryClient = useQueryClient();
    const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedLevel, setSelectedLevel] = React.useState<Level | null>(
        null
    );
    const [deleteLevelData, setDeleteLevelData] = React.useState<Level | null>(
        null
    );
    const [formError, setFormError] = useState<string | null>(null);

    type MutationError =
        | { statusCode?: number; name?: string; message?: string }
        | unknown;
    const createMutation = useMutation({
        mutationFn: createLevel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["levels"] });
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
                    setFormError(err.message || "Ce niveau existe déjà.");

                    return;
                }
            }
            setFormError("Erreur lors de la création du niveau.");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: { name?: string; code?: string };
        }) => updateLevel(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["levels"] });
            setIsAddEditDialogOpen(false);
            setSelectedLevel(null);
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
                    setFormError(err.message || "Ce niveau existe déjà.");

                    return;
                }
            }
            setFormError("Erreur lors de la modification du niveau.");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteLevel(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["levels"] });
            setIsDeleteDialogOpen(false);
            setDeleteLevelData(null);
        },
    });

    const handleAdd = () => {
        setFormError(null);
        setSelectedLevel(null);
        setIsAddEditDialogOpen(true);
    };

    const handleEdit = (level: Level) => {
        setFormError(null);
        setSelectedLevel(level);
        setIsAddEditDialogOpen(true);
    };

    const handleDelete = (level: Level) => {
        setFormError(null);
        setDeleteLevelData(level);
        setIsDeleteDialogOpen(true);
    };

    const handleDialogSubmit = (data: { name: string; code?: string }) => {
        setFormError(null);
        if (selectedLevel?.id) {
            updateMutation.mutate({ id: selectedLevel.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDeleteConfirm = () => {
        if (deleteLevelData?.id) {
            deleteMutation.mutate(deleteLevelData.id);
        }
    };

    return (
        <div className="container space-y-6 py-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">
                        Niveaux
                    </CardTitle>
                    <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={handleAdd}
                    >
                        <Plus className="mr-2 size-4" />
                        Ajouter un niveau
                    </Button>
                </CardHeader>
                <CardContent className="max-h-[60vh] overflow-auto">
                    <LevelList onDelete={handleDelete} onEdit={handleEdit} />
                </CardContent>
            </Card>

            <LevelDialog
                error={formError}
                initialData={selectedLevel || undefined}
                open={isAddEditDialogOpen}
                onClose={() => setIsAddEditDialogOpen(false)}
                onSubmit={handleDialogSubmit}
            />

            <LevelDeleteDialog
                levelName={deleteLevelData?.name || ""}
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
