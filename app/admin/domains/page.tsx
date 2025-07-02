"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

import { Domain } from "@/core/entities/domain.entity";
import {
    createDomain,
    deleteDomain,
    updateDomain,
} from "@/infrastructure/server-actions/domain.actions";
import { Button } from "@/presentation/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DomainDeleteDialog } from "./components/domain-delete-dialog";
import { DomainDialog } from "./components/DomainDialog";
import { DomainList } from "./components/DomainList";

export default function DomainPage() {
    const queryClient = useQueryClient();
    const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedDomain, setSelectedDomain] = React.useState<Domain | null>(
        null
    );
    const [deleteDomainData, setDeleteDomainData] =
        React.useState<Domain | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    type MutationError =
        | { statusCode?: number; name?: string; message?: string }
        | unknown;

    const createMutation = useMutation({
        mutationFn: createDomain,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["domains"] });
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
                    setFormError(err.message || "Ce domaine existe déjà.");

                    return;
                }
            }
            setFormError("Erreur lors de la création du domaine.");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: { name?: string } }) =>
            updateDomain(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["domains"] });
            setIsAddEditDialogOpen(false);
            setSelectedDomain(null);
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
                    setFormError(err.message || "Ce domaine existe déjà.");

                    return;
                }
            }
            setFormError("Erreur lors de la modification du domaine.");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteDomain(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["domains"] });
            setIsDeleteDialogOpen(false);
            setDeleteDomainData(null);
        },
    });

    const handleAdd = () => {
        setFormError(null);
        setSelectedDomain(null);
        setIsAddEditDialogOpen(true);
    };

    const handleEdit = (domain: Domain) => {
        setFormError(null);
        setSelectedDomain(domain);
        setIsAddEditDialogOpen(true);
    };

    const handleDelete = (domain: Domain) => {
        setFormError(null);
        setDeleteDomainData(domain);
        setIsDeleteDialogOpen(true);
    };

    const handleDialogSubmit = (data: { name: string }) => {
        setFormError(null);
        if (selectedDomain?.id) {
            updateMutation.mutate({ id: selectedDomain.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDeleteConfirm = () => {
        if (deleteDomainData?.id) {
            deleteMutation.mutate(deleteDomainData.id);
        }
    };

    return (
        <div className="container space-y-6 py-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">
                        Domaines
                    </CardTitle>
                    <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={handleAdd}
                    >
                        <Plus className="mr-2 size-4" />
                        Ajouter un domaine
                    </Button>
                </CardHeader>
                <CardContent className="max-h-[60vh] overflow-auto">
                    <DomainList onDelete={handleDelete} onEdit={handleEdit} />
                </CardContent>
            </Card>

            <DomainDialog
                error={formError}
                initialData={selectedDomain || undefined}
                open={isAddEditDialogOpen}
                onClose={() => setIsAddEditDialogOpen(false)}
                onSubmit={handleDialogSubmit}
            />

            <DomainDeleteDialog
                domainName={deleteDomainData?.name || ""}
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
