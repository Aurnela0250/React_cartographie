"use client";

import { useEffect } from "react";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
    createLevel,
    updateLevel,
} from "@/infrastructure/server-actions/level.actions";
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

import { useLevelStore } from "./level-store";

const formSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    acronym: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function LevelDialog() {
    const queryClient = useQueryClient();
    const {
        isAddEditDialogOpen: open,
        setIsAddEditDialogOpen: setOpen,
        selectedLevel: initialData,
        formError: error,
        setFormError,
        setSelectedLevel,
    } = useLevelStore();

    type MutationError =
        | { statusCode?: number; name?: string; message?: string }
        | unknown;

    const createMutation = useMutation({
        mutationFn: createLevel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["levels"] });
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
                    setFormError(err.message || "Ce niveau existe déjà.");

                    return;
                }
            }
            setFormError("Erreur lors de la création du niveau.");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: { name?: string; acronym?: string };
        }) => updateLevel(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["levels"] });
            setOpen(false);
            setSelectedLevel(null);
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
                    setFormError(err.message || "Ce niveau existe déjà.");

                    return;
                }
            }
            setFormError("Erreur lors de la modification du niveau.");
        },
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            acronym: initialData?.acronym || "",
        },
    });

    const isEditing = !!initialData?.id;

    useEffect(() => {
        if (open) {
            form.reset({
                name: initialData?.name || "",
                acronym: initialData?.acronym || "",
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
                        {isEditing ? "Modifier le niveau" : "Ajouter un niveau"}
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
                                            placeholder="Nom du niveau"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="acronym"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Acronyme</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Acronyme du niveau"
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
