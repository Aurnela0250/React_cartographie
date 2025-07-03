"use client";

import { Plus } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";

import { useLevelStore } from "./level-store";

export function LevelAddButton() {
    const { setIsAddEditDialogOpen, setSelectedLevel, setFormError } =
        useLevelStore();
    const handleAdd = () => {
        setFormError(null);
        setSelectedLevel(null);
        setIsAddEditDialogOpen(true);
    };

    return (
        <Button className="bg-primary hover:bg-primary/90" onClick={handleAdd}>
            <Plus className="mr-2 size-4" /> Ajouter un niveau
        </Button>
    );
}
