"use client";

import { Plus } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";

import { useRegionStore } from "./region-store";

export function RegionAddButton() {
    const { setIsAddEditDialogOpen, setSelectedRegion } = useRegionStore();

    const handleAdd = () => {
        setSelectedRegion(null); // Réinitialise pour une création
        setIsAddEditDialogOpen(true);
    };

    return (
        <Button className="bg-primary hover:bg-primary/90" onClick={handleAdd}>
            <Plus className="mr-2 size-4" />
            Ajouter une région
        </Button>
    );
}
