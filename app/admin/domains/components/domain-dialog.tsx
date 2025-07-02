"use client";

import { useEffect } from "react";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
    createDomain,
    updateDomain,
} from "@/infrastructure/server-actions/domain.actions";
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

import { useDomainStore } from "./domain-store";

const formSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
});

type FormValues = z.infer<typeof formSchema>;

export function DomainDialog() {
    const queryClient = useQueryClient();
    const {
        isAddEditDialogOpen: open,
        setIsAddEditDialogOpen: setOpen,
        selectedDomain: initialData,
        formError: error,
        setFormError,
        setSelectedDomain,
    } = useDomainStore();

    type MutationError =
        | { statusCode?: number; name?: string; message?: string }
        | unknown;

    const createMutation = useMutation({
        mutationFn: createDomain,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["domains"] });
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
                    setFormError(err.message || "Ce domaine existe déjà.");

                    return;
                }
            }
            setFormError("Erreur lors de la création du domaine.");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: { name?: string } }) =>
            updateDomain(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["domains"] });
            setOpen(false);
            setSelectedDomain(null);
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
                    setFormError(err.message || "Ce domaine existe déjà.");

                    return;
                }
            }
            setFormError("Erreur lors de la modification du domaine.");
        },
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
        },
    });

    const isEditing = !!initialData?.id;

    useEffect(() => {
        if (open) {
            form.reset({
                name: initialData?.name || "",
            });
        }
    }, [initialData, open, form]);

    function handleSubmit(data: FormValues) {
        setFormError(null);
        if (initialData?.id) {
            updateMutation.mutate({ id: initialData.id, data });
        } else {
            createMutation.mutate(data);
        }
    }

    return (
        <Dialog open={open} onOpenChange={() => setOpen(false)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? "Modifier le domaine"
                            : "Ajouter un nouveau domaine"}
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
                                            placeholder="Nom du domaine"
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
                                onClick={() => setOpen(false)}
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
