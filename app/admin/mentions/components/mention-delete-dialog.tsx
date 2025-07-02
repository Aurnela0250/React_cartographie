"use client";

import { AlertTriangle, Check, X } from "lucide-react";

import { deleteMention } from "@/infrastructure/server-actions/mention.actions";
import { Button } from "@/presentation/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useMentionStore } from "./mention-store";

export function MentionDeleteDialog() {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteMention(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mentions"] });
            setIsDeleteDialogOpen(false);
            setSelectedMention(null);
        },
    });

    const {
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        selectedMention,
        setSelectedMention,
    } = useMentionStore();

    const handleConfirm = () => {
        if (selectedMention?.id) {
            deleteMutation.mutate(selectedMention.id);
        }
    };

    return (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center text-destructive">
                        <AlertTriangle className="mr-2 size-5" />
                        Supprimer la mention
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p>
                        Voulez-vous vraiment supprimer la mention{" "}
                        <span className="font-semibold">
                            {selectedMention?.name}
                        </span>{" "}
                        ?
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Cette action ne peut pas être annulée.
                    </p>
                </div>
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
                        <Check className="mr-2 size-4" />
                        Confirmer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
