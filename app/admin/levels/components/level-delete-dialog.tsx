"use client";

import { AlertTriangle, Check, X } from "lucide-react";

import { deleteLevel } from "@/infrastructure/server-actions/level.actions";
import { Button } from "@/presentation/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useLevelStore } from "./level-store";

export function LevelDeleteDialog() {
    const queryClient = useQueryClient();
    const {
        isDeleteDialogOpen: open,
        setIsDeleteDialogOpen: setOpen,
        selectedLevel,
        setSelectedLevel,
    } = useLevelStore();
    const levelName = selectedLevel?.name || "";

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteLevel(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["levels"] });
            setOpen(false);
            setSelectedLevel(null);
        },
    });

    function handleConfirm() {
        if (selectedLevel?.id) {
            deleteMutation.mutate(selectedLevel.id);
        }
    }

    return (
        <Dialog open={open} onOpenChange={() => setOpen(false)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center text-destructive">
                        <AlertTriangle className="mr-2 size-5" />
                        Supprimer le niveau
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p>
                        Voulez-vous vraiment supprimer le niveau{" "}
                        <span className="font-semibold">{levelName}</span> ?
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Cette action ne peut pas être annulée.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        <X className="mr-2 size-4" />
                        Annuler
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm}>
                        <Check className="mr-2 size-4" />
                        Confirmer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
