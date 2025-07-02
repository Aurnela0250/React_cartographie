"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";

import { deleteRegion } from "@/infrastructure/server-actions/region.actions";
import { Button } from "@/presentation/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useRegionStore } from "./region-store";

export function RegionDeleteDialog() {
    const queryClient = useQueryClient();
    const {
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        selectedRegion,
        setSelectedRegion,
    } = useRegionStore();

    const deleteMutation = useMutation({
        mutationFn: deleteRegion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["regions"] });
            setIsDeleteDialogOpen(false);
            setSelectedRegion(null);
        },
    });

    const handleConfirm = () => {
        console.log("handleConfirm", selectedRegion);
        if (selectedRegion?.id) {
            deleteMutation.mutate(selectedRegion.id);
        }
    };

    return (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <AlertTriangle className="mr-2 text-destructive" />{" "}
                        Confirmer la suppression
                    </DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer la région "
                        <strong>{selectedRegion?.name || ""}</strong>" ? Cette
                        action est irréversible.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsDeleteDialogOpen(false)}
                    >
                        <X className="mr-2 size-4" />
                        Annuler
                    </Button>
                    <Button
                        disabled={deleteMutation.isPending}
                        variant="destructive"
                        onClick={handleConfirm}
                    >
                        <Trash2 className="mr-2 size-4" />
                        Supprimer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
