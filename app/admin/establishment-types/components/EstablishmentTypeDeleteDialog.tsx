import { AlertTriangle, Check, X } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";

export function EstablishmentTypeDeleteDialog({
    open,
    onClose,
    onConfirm,
    establishmentTypeName,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    establishmentTypeName: string;
}) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
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
                            {establishmentTypeName}
                        </span>{" "}
                        ?
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
                    <Button variant="destructive" onClick={onConfirm}>
                        <Check className="mr-2 size-4" />
                        Supprimer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
