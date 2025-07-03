"use client";

import { useEffect } from "react";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
    createEstablishmentType,
    updateEstablishmentType,
} from "@/infrastructure/server-actions/establishment-type.actions";
import { Button } from "@/presentation/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useEstablishmentTypeStore } from "./establishment-type-store";

const formSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type MutationError =
    | { statusCode?: number; name?: string; message?: string }
    | unknown;

export function EstablishmentTypeDialog() {
    const queryClient = useQueryClient();
    const {
        isAddEditDialogOpen: open,
        setIsAddEditDialogOpen: setOpen,
        selectedEstablishmentType: initialData,
        setSelectedEstablishmentType,
        formError: error,
        setFormError,
    } = useEstablishmentTypeStore();

    const createMutation = useMutation({
        mutationFn: createEstablishmentType,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["establishment-types"],
            });
            setOpen(false);
            setFormError(null);
        },
        onError: (error: MutationError) => {
            if (
                typeof error === "object" &&
                error !== null &&
                ("statusCode" in error || "name" in error)
            ) {
                const err = error as {
                    statusCode?: number;
                    name?: string;
                    message?: string;
                };

                if (err.statusCode === 409 || err.name === "ConflictError") {
                    setFormError(err.message || "Ce type existe déjà.");

                    return;
                }
            }
            setFormError("Erreur lors de la création du type d'établissement.");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: { name?: string; description?: string };
        }) => updateEstablishmentType(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["establishment-types"],
            });
            setOpen(false);
            setSelectedEstablishmentType(null);
            setFormError(null);
        },
        onError: (error: MutationError) => {
            if (
                typeof error === "object" &&
                error !== null &&
                ("statusCode" in error || "name" in error)
            ) {
                const err = error as {
                    statusCode?: number;
                    name?: string;
                    message?: string;
                };

                if (err.statusCode === 409 || err.name === "ConflictError") {
                    setFormError(err.message || "Ce type existe déjà.");

                    return;
                }
            }
            setFormError(
                "Erreur lors de la modification du type d'établissement."
            );
        },
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
        },
    });

    const isEditing = !!initialData?.id;

    useEffect(() => {
        if (open) {
            form.reset({
                name: initialData?.name || "",
                description: initialData?.description || "",
            });
        }
    }, [initialData, open, form]);

    function handleSubmit(data: FormValues) {
        setFormError(null);
        const cleanData = {
            ...data,
            description: data.description ?? undefined,
        };

        if (initialData?.id) {
            updateMutation.mutate({ id: initialData.id, data: cleanData });
        } else {
            createMutation.mutate(cleanData);
        }
    }

    function handleClose() {
        setOpen(false);
        setFormError(null);
        setSelectedEstablishmentType(null);
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? "Modifier le type d'établissement"
                            : "Ajouter un nouveau type d'établissement"}
                    </DialogTitle>
                </DialogHeader>
                {error && (
                    <div className="mb-2 rounded-md bg-destructive/15 p-3 text-center text-destructive">
                        {error}
                    </div>
                )}
                <Form {...form}>
                    <form
                        className="space-y-4"
                        onSubmit={form.handleSubmit(handleSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nom du type"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                            >
                                <X className="mr-2 size-4" />
                                Annuler
                            </Button>
                            <Button type="submit" variant="default">
                                <Save className="mr-2 size-4" />
                                {isEditing ? "Enregistrer" : "Créer"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
