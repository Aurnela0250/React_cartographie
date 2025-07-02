"use client";

import { Plus } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";

import { useCityStore } from "./city-store";

export function CityAddButton() {
    const { setIsAddEditDialogOpen, setSelectedCity } = useCityStore();

    const handleAdd = () => {
        setSelectedCity(null);
        setIsAddEditDialogOpen(true);
    };

    return (
        <Button className="bg-primary hover:bg-primary/90" onClick={handleAdd}>
            <Plus className="mr-2 size-4" /> Ajouter une ville
        </Button>
    );
}
