"use client";

// Page principale pour la gestion des établissements (squelette, à compléter)
import React, { useState } from "react";
import { Plus } from "lucide-react";

import { Establishment } from "@/core/domain/entities/establishment.entity";
import {
    createEstablishment,
    deleteEstablishment,
    updateEstablishment,
} from "@/infrastructure/server-action/establishment.action";
import { Button } from "@/presentation/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { EstablishmentDeleteDialog } from "./components/EstablishmentDeleteDialog";
import { EstablishmentDialog } from "./components/EstablishmentDialog";
import { EstablishmentList } from "./components/EstablishmentList";

type EstablishmentPayload = {
    name: string;
    acronyme?: string;
    address: string;
    contact?: string;
    site_url?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    establishment_type_id: number;
    sector_id: number;
};

export default function EstablishmentPage() {
    const queryClient = useQueryClient();
    const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedEstablishment, setSelectedEstablishment] =
        useState<Establishment | null>(null);
    const [deleteEstablishmentData, setDeleteEstablishmentData] =
        useState<Establishment | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    type MutationError =
        | { statusCode?: number; name?: string; message?: string }
        | unknown;

    const createMutation = useMutation({
        mutationFn: createEstablishment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["establishments"] });
            setIsAddEditDialogOpen(false);
            setFormError(null);
        },
        onError: (error: MutationError) => {
            setFormError("Erreur lors de la création de l'établissement.");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: EstablishmentPayload;
        }) => updateEstablishment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["establishments"] });
            setIsAddEditDialogOpen(false);
            setSelectedEstablishment(null);
            setFormError(null);
        },
        onError: (error: MutationError) => {
            setFormError("Erreur lors de la modification de l'établissement.");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteEstablishment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["establishments"] });
            setIsDeleteDialogOpen(false);
            setDeleteEstablishmentData(null);
        },
    });

    const handleAdd = () => {
        setFormError(null);
        setSelectedEstablishment(null);
        setIsAddEditDialogOpen(true);
    };

    const handleEdit = (establishment: Establishment) => {
        setFormError(null);
        setSelectedEstablishment(establishment);
        setIsAddEditDialogOpen(true);
    };

    const handleDelete = (establishment: Establishment) => {
        setFormError(null);
        setDeleteEstablishmentData(establishment);
        setIsDeleteDialogOpen(true);
    };

    const handleDialogSubmit = (data: EstablishmentPayload) => {
        setFormError(null);
        if (selectedEstablishment?.id) {
            updateMutation.mutate({ id: selectedEstablishment.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDeleteConfirm = () => {
        if (deleteEstablishmentData?.id) {
            deleteMutation.mutate(deleteEstablishmentData.id);
        }
    };

    return (
        <div className="container space-y-6 py-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">
                        Établissements
                    </CardTitle>
                    <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={handleAdd}
                    >
                        <Plus className="mr-2 size-4" />
                        Ajouter un établissement
                    </Button>
                </CardHeader>
                <CardContent className="max-h-[60vh] overflow-auto">
                    <EstablishmentList
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                </CardContent>
            </Card>
            <EstablishmentDialog
                error={formError}
                initialData={selectedEstablishment || undefined}
                open={isAddEditDialogOpen}
                onClose={() => setIsAddEditDialogOpen(false)}
                onSubmit={handleDialogSubmit}
            />
            <EstablishmentDeleteDialog
                establishmentName={deleteEstablishmentData?.name || ""}
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
