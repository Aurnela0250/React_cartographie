"use client";

import { Plus } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";

import { useDomainStore } from "./domain-store";

export function DomainAddButton() {
    const { setIsAddEditDialogOpen, setSelectedDomain, setFormError } =
        useDomainStore();
    const handleAdd = () => {
        setFormError(null);
        setSelectedDomain(null);
        setIsAddEditDialogOpen(true);
    };

    return (
        <Button className="bg-primary hover:bg-primary/90" onClick={handleAdd}>
            <Plus className="mr-2 size-4" /> Ajouter un domaine
        </Button>
    );
}
