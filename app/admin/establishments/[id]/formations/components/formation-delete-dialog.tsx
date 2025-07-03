"use client";

import { useParams } from "next/navigation";
import { AlertTriangle, Check, X } from "lucide-react";

import { deleteFormation } from "@/infrastructure/server-actions/formation.actions";
import { Button } from "@/presentation/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useFormationStore } from "./formation-store";

export function FormationsDeleteDialog() {
    const { id: establishmentId } = useParams<{ id: string }>();
    const {
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        selectedFormation,
        setSelectedFormation,
    } = useFormationStore();
    const queryClient = useQueryClient();

    const handleClose = () => {
        setIsDeleteDialogOpen(false);
        setSelectedFormation(null);
    };

    const deleteMutation = useMutation({
        mutationFn: () => {
            if (!selectedFormation?.id)
                throw new Error("ID de formation manquant");
            return deleteFormation(selectedFormation.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["formations", establishmentId],
            });
            handleClose();
        },
        onError: (err) => {
            // Optionally handle error, e.g., show a toast
            console.error(err.message);
        },
    });

    const onConfirm = () => {
        deleteMutation.mutate();
    };

    return (
        <Dialog open={isDeleteDialogOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center text-destructive">
                        <AlertTriangle className="mr-2 size-5" />
                        Supprimer la formation
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p>
                        Voulez-vous vraiment supprimer la formation{" "}
                        <span className="font-semibold">
                            {selectedFormation?.name}
                        </span>{" "}
                        ?
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Cette action ne peut pas être annulée.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        <X className="mr-2 size-4" /> Annuler
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={deleteMutation.isPending}
                    >
                        <Check className="mr-2 size-4" /> Confirmer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
