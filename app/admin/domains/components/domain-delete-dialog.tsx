"use client";

import { AlertTriangle, Check, X } from "lucide-react";

import { deleteDomain } from "@/infrastructure/server-actions/domain.actions";
import { Button } from "@/presentation/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useDomainStore } from "./domain-store";

export function DomainDeleteDialog() {
    const queryClient = useQueryClient();
    const {
        isDeleteDialogOpen: open,
        setIsDeleteDialogOpen: setOpen,
        selectedDomain,
        setSelectedDomain,
    } = useDomainStore();
    const domainName = selectedDomain?.name || "";

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteDomain(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["domains"] });
            setOpen(false);
            setSelectedDomain(null);
        },
    });

    function handleConfirm() {
        if (selectedDomain?.id) {
            deleteMutation.mutate(selectedDomain.id);
        }
    }

    return (
        <Dialog open={open} onOpenChange={() => setOpen(false)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center text-destructive">
                        <AlertTriangle className="mr-2 size-5" />
                        Supprimer le domaine
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p>
                        Voulez-vous vraiment supprimer le domaine{" "}
                        <span className="font-semibold">{domainName}</span> ?
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
