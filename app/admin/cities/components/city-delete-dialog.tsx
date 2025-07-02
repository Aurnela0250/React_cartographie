"use client";

import { AlertTriangle, Check, X } from "lucide-react";

import { deleteCity } from "@/infrastructure/server-actions/city.actions";
import { Button } from "@/presentation/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useCityStore } from "./city-store";

export function CityDeleteDialog() {
    const queryClient = useQueryClient();
    const {
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        selectedCity,
        setSelectedCity,
    } = useCityStore();
    const cityName = selectedCity?.name || "";

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteCity(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cities"] });
            setIsDeleteDialogOpen(false);
            setSelectedCity(null);
        },
    });

    const handleConfirm = () => {
        if (selectedCity?.id) {
            deleteMutation.mutate(selectedCity.id);
        }
    };

    return (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center text-destructive">
                        <AlertTriangle className="mr-2 size-5" />
                        Supprimer la ville
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p>
                        Voulez-vous vraiment supprimer la ville{" "}
                        <span className="font-semibold">{cityName}</span> ?
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
