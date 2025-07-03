"use client";

import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
    createFormationAuthorization,
    updateFormationAuthorization,
} from "@/infrastructure/server-actions/formation.actions";
import { Button } from "@/presentation/components/ui/button";
import { Calendar } from "@/presentation/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/presentation/components/ui/form";
import { Input } from "@/presentation/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/presentation/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/presentation/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useFormationStore } from "./formation-store";

const statusOptions = [
    { value: "REQUESTED", label: "En cours" },
    { value: "VALIDATED", label: "Validée" },
    { value: "REFUSED", label: "Refusée" },
    { value: "EXPIRED", label: "Expirée" },
];

const formSchema = z.object({
    dateDebut: z.string().min(4, "Date de début requise"),
    dateFin: z.string().optional(),
    status: z.enum(["REQUESTED", "VALIDATED", "REFUSED", "EXPIRED"], {
        required_error: "Statut requis",
    }),
    arrete: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function AuthorizationForm({ onClose }: { onClose: () => void }) {
    const { selectedFormation, setFormError, formError } = useFormationStore();
    const queryClient = useQueryClient();
    const initialData = selectedFormation?.authorization;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dateDebut: initialData?.dateDebut ?? "",
            dateFin: initialData?.dateFin ?? "",
            status: (initialData?.status as FormValues["status"]) ?? undefined,
            arrete: (initialData as any)?.arrete ?? initialData?.decree ?? "",
        },
    });

    const createMutation = useMutation({
        mutationFn: (data: FormValues) => {
            if (!selectedFormation?.id)
                throw new Error("ID de formation manquant");
            return createFormationAuthorization(selectedFormation.id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["formations", selectedFormation?.establishmentId],
            });
            onClose();
        },
        onError: (err) => setFormError(err.message),
    });

    const updateMutation = useMutation({
        mutationFn: (data: FormValues) => {
            if (!selectedFormation?.id)
                throw new Error("ID de formation manquant");
            return updateFormationAuthorization(selectedFormation.id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["formations", selectedFormation?.establishmentId],
            });
            onClose();
        },
        onError: (err) => setFormError(err.message),
    });

    const onSubmit = (data: FormValues) => {
        if (initialData) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="dateDebut"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date de début</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        className={
                                            "w-full justify-start text-left font-normal" +
                                            (field.value
                                                ? ""
                                                : " text-muted-foreground")
                                        }
                                        variant="outline"
                                    >
                                        {field.value
                                            ? field.value
                                            : "Sélectionner une date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={
                                            field.value
                                                ? new Date(field.value)
                                                : undefined
                                        }
                                        onSelect={(date) => {
                                            if (!date)
                                                return field.onChange("");
                                            const local = new Date(
                                                date.getTime() -
                                                    date.getTimezoneOffset() *
                                                        60000
                                            );
                                            field.onChange(
                                                local.toISOString().slice(0, 10)
                                            );
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dateFin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date de fin</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        className={
                                            "w-full justify-start text-left font-normal" +
                                            (field.value
                                                ? ""
                                                : " text-muted-foreground")
                                        }
                                        variant="outline"
                                    >
                                        {field.value
                                            ? field.value
                                            : "Sélectionner une date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={
                                            field.value
                                                ? new Date(field.value)
                                                : undefined
                                        }
                                        onSelect={(date) => {
                                            if (!date)
                                                return field.onChange("");
                                            const local = new Date(
                                                date.getTime() -
                                                    date.getTimezoneOffset() *
                                                        60000
                                            );
                                            field.onChange(
                                                local.toISOString().slice(0, 10)
                                            );
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Statut</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sélectionner un statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((opt) => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="arrete"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Arrêté</FormLabel>
                            <FormControl>
                                <Input {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {formError && (
                    <div className="text-sm text-destructive">{formError}</div>
                )}
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        <X className="mr-2 size-4" /> Annuler
                    </Button>
                    <Button
                        type="submit"
                        disabled={
                            createMutation.isPending || updateMutation.isPending
                        }
                    >
                        <Save className="mr-2 size-4" />
                        {initialData ? "Enregistrer" : "Créer"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export function FormationAuthorizationDialog() {
    const {
        isAuthorizationDialogOpen,
        setIsAuthorizationDialogOpen,
        selectedFormation,
        setSelectedFormation,
        setFormError,
    } = useFormationStore();

    const handleClose = () => {
        setIsAuthorizationDialogOpen(false);
        setSelectedFormation(null);
        setFormError(null);
    };

    return (
        <Dialog open={isAuthorizationDialogOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {selectedFormation?.authorization
                            ? "Modifier l'autorisation"
                            : "Ajouter une autorisation"}
                    </DialogTitle>
                </DialogHeader>
                {isAuthorizationDialogOpen && (
                    <AuthorizationForm
                        key={selectedFormation?.authorization?.id ?? "new"}
                        onClose={handleClose}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
