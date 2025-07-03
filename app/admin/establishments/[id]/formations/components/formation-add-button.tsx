"use client";

import { Plus } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";

import { useFormationStore } from "./formation-store";

export function FormationAddButton() {
    const { setIsAddEditDialogOpen, setSelectedFormation } =
        useFormationStore();
    const handleAdd = () => {
        setSelectedFormation(null);
        setIsAddEditDialogOpen(true);
    };
    return (
        <Button className="bg-primary hover:bg-primary/90" onClick={handleAdd}>
            <Plus className="mr-2 size-4" /> Ajouter une formation
        </Button>
    );
}
