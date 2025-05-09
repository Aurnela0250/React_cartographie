import { AlertTriangle, Check, X } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";

export function RegionDeleteDialog({
    open,
    onClose,
    onConfirm,
    regionName,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    regionName: string;
}) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center text-destructive">
                        <AlertTriangle className="mr-2 size-5" />
                        Supprimer la région
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p>
                        Voulez-vous vraiment supprimer la région{" "}
                        <span className="font-semibold">{regionName}</span> ?
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Cette action ne peut pas être annulée.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        <X className="mr-2 size-4" />
                        Annuler
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onConfirm();
                            // La fermeture du dialogue et le rafraîchissement des données sont gérés
                            // par le composant parent (RegionPage) dans le callback onSuccess de la mutation.
                        }}
                    >
                        <Check className="mr-2 size-4" />
                        Confirmer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
