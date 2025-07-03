"use client";

import { AlertTriangle, Check, X } from "lucide-react";

import { deleteEstablishmentType } from "@/infrastructure/server-actions/establishment-type.actions";
import { Button } from "@/presentation/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useEstablishmentTypeStore } from "./establishment-type-store";

export function EstablishmentTypeDeleteDialog() {
    const queryClient = useQueryClient();
    const {
        isDeleteDialogOpen: open,
        setIsDeleteDialogOpen: setOpen,
        selectedEstablishmentType,
        setSelectedEstablishmentType,
    } = useEstablishmentTypeStore();

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteEstablishmentType(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["establishment-types"],
            });
            setOpen(false);
            setSelectedEstablishmentType(null);
        },
    });

    const handleClose = () => {
        setOpen(false);
        setSelectedEstablishmentType(null);
    };

    const handleConfirm = () => {
        if (selectedEstablishmentType?.id) {
            deleteMutation.mutate(selectedEstablishmentType.id);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center text-destructive">
                        <AlertTriangle className="mr-2 size-5" />
                        Supprimer le type d'établissement
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p>
                        Voulez-vous vraiment supprimer le type d'établissement{" "}
                        <span className="font-semibold">
                            {selectedEstablishmentType?.name || ""}
                        </span>{" "}
                        ?
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Cette action ne peut pas être annulée.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        <X className="mr-2 size-4" />
                        Annuler
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm}>
                        <Check className="mr-2 size-4" />
                        Supprimer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
