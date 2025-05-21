"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

import { Mention } from "@/core/entities/mention.entity";
import {
    createMention,
    deleteMention,
    updateMention,
} from "@/infrastructure/server-actions/mention.actions";
import { Button } from "@/presentation/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MentionDeleteDialog } from "./components/MentionDeleteDialog";
import { MentionDialog } from "./components/MentionDialog";
import { MentionList } from "./components/MentionList";

export default function MentionPage() {
    const queryClient = useQueryClient();
    const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedMention, setSelectedMention] =
        React.useState<Mention | null>(null);
    const [deleteMentionData, setDeleteMentionData] =
        React.useState<Mention | null>(null);

    const [formError, setFormError] = useState<string | null>(null);

    type MutationError =
        | { statusCode?: number; name?: string; message?: string }
        | unknown;

    const createMutation = useMutation({
        mutationFn: createMention,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mentions"] });
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
                    setFormError(err.message || "Cette mention existe déjà.");

                    return;
                }
            }
            setFormError("Erreur lors de la création de la mention.");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: { name?: string; domainId?: number };
        }) => updateMention(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mentions"] });
            setIsAddEditDialogOpen(false);
            setSelectedMention(null);
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
                    setFormError(err.message || "Cette mention existe déjà.");

                    return;
                }
            }
            setFormError("Erreur lors de la modification de la mention.");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteMention(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mentions"] });
            setIsDeleteDialogOpen(false);
            setDeleteMentionData(null);
        },
    });

    const handleAdd = () => {
        setFormError(null);
        setSelectedMention(null);
        setIsAddEditDialogOpen(true);
    };

    const handleEdit = (mention: Mention) => {
        setFormError(null);
        setSelectedMention(mention);
        setIsAddEditDialogOpen(true);
    };

    const handleDelete = (mention: Mention) => {
        setFormError(null);
        setDeleteMentionData(mention);
        setIsDeleteDialogOpen(true);
    };

    const handleDialogSubmit = (data: { name: string; domainId: number }) => {
        setFormError(null);
        if (selectedMention?.id) {
            updateMutation.mutate({ id: selectedMention.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDeleteConfirm = () => {
        if (deleteMentionData?.id) {
            deleteMutation.mutate(deleteMentionData.id);
        }
    };

    return (
        <div className="container space-y-6 py-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">
                        Mentions
                    </CardTitle>
                    <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={handleAdd}
                    >
                        <Plus className="mr-2 size-4" />
                        Ajouter une mention
                    </Button>
                </CardHeader>
                <CardContent className="max-h-[60vh] overflow-auto">
                    <MentionList onDelete={handleDelete} onEdit={handleEdit} />
                </CardContent>
            </Card>

            <MentionDialog
                error={formError}
                initialData={selectedMention || undefined}
                open={isAddEditDialogOpen}
                onClose={() => setIsAddEditDialogOpen(false)}
                onSubmit={handleDialogSubmit}
            />

            <MentionDeleteDialog
                mentionName={deleteMentionData?.name || ""}
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
