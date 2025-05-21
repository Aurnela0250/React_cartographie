import { AlertTriangle, Check, X } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";

export function AnnualHeadcountDeleteDialog({
    open,
    onClose,
    onConfirm,
    academicYear,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    academicYear: number;
}) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center text-destructive">
                        <AlertTriangle className="mr-2 size-5" />
                        Supprimer l'effectif annuel
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p>
                        Voulez-vous vraiment supprimer l'effectif pour l'année
                        universitaire {academicYear} ?
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Cette action ne peut pas être annulée.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        <X className="mr-2 size-4" /> Annuler
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        <Check className="mr-2 size-4" /> Confirmer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
