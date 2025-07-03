"use client";

import { Plus } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";

import { useEstablishmentTypeStore } from "./establishment-type-store";

export function EstablishmentTypeAddButton() {
    const {
        setIsAddEditDialogOpen,
        setSelectedEstablishmentType,
        setFormError,
    } = useEstablishmentTypeStore();
    const handleAdd = () => {
        setFormError(null);
        setSelectedEstablishmentType(null);
        setIsAddEditDialogOpen(true);
    };

    return (
        <Button className="bg-primary hover:bg-primary/90" onClick={handleAdd}>
            <Plus className="mr-2 size-4" /> Ajouter un type
        </Button>
    );
}
