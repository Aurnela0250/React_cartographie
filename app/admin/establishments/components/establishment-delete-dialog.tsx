"use client";

import { AlertTriangle, Check, X } from "lucide-react";

import { deleteEstablishment } from "@/infrastructure/server-actions/establishment.action";
import { Button } from "@/presentation/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useEstablishmentStore } from "./establishment-store";

export function EstablishmentDeleteDialog() {
    const queryClient = useQueryClient();
    const { isDeleteDialogOpen, selectedEstablishment, closeDialogs } =
        useEstablishmentStore();
    const establishmentName = selectedEstablishment?.name || "";

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteEstablishment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["establishments"] });
            closeDialogs();
        },
    });

    const handleConfirm = () => {
        if (selectedEstablishment?.id) {
            deleteMutation.mutate(selectedEstablishment.id);
        }
    };

    return (
        <Dialog open={isDeleteDialogOpen} onOpenChange={closeDialogs}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center text-destructive">
                        <AlertTriangle className="mr-2 size-5" />
                        Supprimer l'établissement
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p>
                        Voulez-vous vraiment supprimer l'établissement{" "}
                        <span className="font-semibold">
                            {establishmentName}
                        </span>{" "}
                        ?
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Cette action ne peut pas être annulée.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={closeDialogs}>
                        <X className="mr-2 size-4" />
                        Annuler
                    </Button>
                    <Button
                        disabled={deleteMutation.isPending}
                        variant="destructive"
                        onClick={handleConfirm}
                    >
                        <Check className="mr-2 size-4" />
                        Confirmer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
