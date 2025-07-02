"use client";

import { useEffect } from "react";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
    createRegion,
    updateRegion,
} from "@/infrastructure/server-actions/region.actions";
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

import { useRegionStore } from "./region-store";

const formSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
});

type FormValues = z.infer<typeof formSchema>;
type MutationError =
    | { message?: string; statusCode?: number; name?: string }
    | unknown;

export function RegionDialog() {
    const queryClient = useQueryClient();
    const {
        isAddEditDialogOpen,
        setIsAddEditDialogOpen,
        selectedRegion,
        formError,
        setFormError,
        setSelectedRegion,
    } = useRegionStore();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const isEditing = !!selectedRegion?.id;

    const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["regions"] });
        setIsAddEditDialogOpen(false);
        setFormError(null);
        setSelectedRegion(null);
    };

    const handleError = (error: MutationError) => {
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
                setFormError(err.message || "Cette région existe déjà.");

                return;
            }
        }
        setFormError("Une erreur est survenue.");
    };

    const createMutation = useMutation({
        mutationFn: createRegion,
        onSuccess: handleSuccess,
        onError: handleError,
    });
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: { name: string } }) =>
            updateRegion(id, data),
        onSuccess: handleSuccess,
        onError: handleError,
    });

    useEffect(() => {
        if (isAddEditDialogOpen) {
            form.reset({ name: selectedRegion?.name || "" });
            setFormError(null);
        }
    }, [selectedRegion, isAddEditDialogOpen, form, setFormError]);

    function handleSubmit(data: FormValues) {
        if (selectedRegion?.id) {
            updateMutation.mutate({ id: selectedRegion.id, data });
        } else {
            createMutation.mutate(data);
        }
    }

    return (
        <Dialog
            open={isAddEditDialogOpen}
            onOpenChange={setIsAddEditDialogOpen}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? "Modifier la région"
                            : "Ajouter une région"}
                    </DialogTitle>
                </DialogHeader>
                {formError && (
                    <div className="mb-2 rounded-md bg-destructive/15 p-3 text-center text-destructive">
                        {formError}
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
                                            placeholder="Nom de la région"
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
                                onClick={() => setIsAddEditDialogOpen(false)}
                            >
                                <X className="mr-2 size-4" /> Annuler
                            </Button>
                            <Button
                                disabled={
                                    createMutation.isPending ||
                                    updateMutation.isPending
                                }
                                type="submit"
                                variant="default"
                            >
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
