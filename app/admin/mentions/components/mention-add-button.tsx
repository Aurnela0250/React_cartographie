"use client";

import { Plus } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";

import { useMentionStore } from "./mention-store";

export function MentionAddButton() {
    const { setIsAddEditDialogOpen, setSelectedMention } = useMentionStore();

    const handleAdd = () => {
        setSelectedMention(null);
        setIsAddEditDialogOpen(true);
    };

    return (
        <Button className="bg-primary hover:bg-primary/90" onClick={handleAdd}>
            <Plus className="mr-2 size-4" /> Ajouter une mention
        </Button>
    );
}
