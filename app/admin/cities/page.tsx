"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

import { City } from "@/core/domain/entities/city.entity";
import {
    createCity,
    deleteCity,
    updateCity,
} from "@/infrastructure/server-action/city.actions";
import { Button } from "@/presentation/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CityDeleteDialog } from "./components/CityDeleteDialog";
import { CityDialog } from "./components/CityDialog";
import { CityList } from "./components/CityList";

export default function CityPage() {
    const queryClient = useQueryClient();
    const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCity, setSelectedCity] = React.useState<City | null>(null);
    const [deleteCityData, setDeleteCityData] = React.useState<City | null>(
        null
    );
    const [formError, setFormError] = useState<string | null>(null);

    type MutationError =
        | { statusCode?: number; name?: string; message?: string }
        | unknown;

    const createMutation = useMutation({
        mutationFn: createCity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cities"] });
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
                    setFormError(err.message || "Cette ville existe déjà.");

                    return;
                }
            }
            setFormError("Erreur lors de la création de la ville.");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: { name?: string; region_id?: number };
        }) => updateCity(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cities"] });
            setIsAddEditDialogOpen(false);
            setSelectedCity(null);
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
                    setFormError(err.message || "Cette ville existe déjà.");

                    return;
                }
            }
            setFormError("Erreur lors de la modification de la ville.");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteCity(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cities"] });
            setIsDeleteDialogOpen(false);
            setDeleteCityData(null);
        },
    });

    const handleAdd = () => {
        setFormError(null);
        setSelectedCity(null);
        setIsAddEditDialogOpen(true);
    };

    const handleEdit = (city: City) => {
        setFormError(null);
        setSelectedCity(city);
        setIsAddEditDialogOpen(true);
    };

    const handleDelete = (city: City) => {
        setFormError(null);
        setDeleteCityData(city);
        setIsDeleteDialogOpen(true);
    };

    const handleDialogSubmit = (data: { name: string; region_id: number }) => {
        setFormError(null);
        if (selectedCity?.id) {
            updateMutation.mutate({ id: selectedCity.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDeleteConfirm = () => {
        if (deleteCityData?.id) {
            deleteMutation.mutate(deleteCityData.id);
        }
    };

    return (
        <div className="container space-y-6 py-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">Villes</CardTitle>
                    <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={handleAdd}
                    >
                        <Plus className="mr-2 size-4" /> Ajouter une ville
                    </Button>
                </CardHeader>
                <CardContent className="max-h-[60vh] overflow-auto">
                    <CityList onDelete={handleDelete} onEdit={handleEdit} />
                </CardContent>
            </Card>

            <CityDialog
                error={formError}
                initialData={selectedCity || undefined}
                open={isAddEditDialogOpen}
                onClose={() => setIsAddEditDialogOpen(false)}
                onSubmit={handleDialogSubmit}
            />

            <CityDeleteDialog
                cityName={deleteCityData?.name || ""}
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
