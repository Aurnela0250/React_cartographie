"use client";

import { Plus } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";

import { useEstablishmentStore } from "./establishment-store";

export function EstablishmentAddButton() {
    const { openForAdd } = useEstablishmentStore();

    return (
        <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => openForAdd()}
        >
            <Plus className="mr-2 size-4" /> Ajouter un établissement
        </Button>
    );
}
