"use client";

import { useEffect } from "react";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import type { Region } from "@/core/entities/region.entity";
import {
    createCity,
    updateCity,
} from "@/infrastructure/server-actions/city.actions";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/presentation/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useCityStore } from "./city-store";

const formSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    regionId: z.coerce
        .number({ invalid_type_error: "La région est requise" })
        .min(1, "La région est requise"),
});

type FormValues = z.infer<typeof formSchema>;
type MutationError =
    | { message?: string; statusCode?: number; name?: string }
    | unknown;

export function CityDialog() {
    const queryClient = useQueryClient();
    const {
        isAddEditDialogOpen,
        setIsAddEditDialogOpen,
        selectedCity,
        formError,
        setFormError,
        setSelectedCity,
    } = useCityStore();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const isEditing = !!selectedCity?.id;

    const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["cities"] });
        setIsAddEditDialogOpen(false);
        setFormError(null);
        setSelectedCity(null);
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
                setFormError(err.message || "Cette ville existe déjà.");

                return;
            }
        }
        setFormError("Une erreur est survenue.");
    };

    const createMutation = useMutation({
        mutationFn: createCity,
        onSuccess: handleSuccess,
        onError: handleError,
    });
    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: { name: string; regionId: number };
        }) => updateCity(id, data),
        onSuccess: handleSuccess,
        onError: handleError,
    });

    // Récupérer les régions pour le select
    const {
        data: regions,
        isLoading: isLoadingRegions,
        error: regionsError,
    } = useQuery<Region[]>({
        queryKey: ["regions"],
        queryFn: async () => {
            const res = await fetch("/api/regions?page=1&per_page=100");
            const json = await res.json();

            return Array.isArray(json) ? json : json.items || [];
        },
    });

    useEffect(() => {
        if (isAddEditDialogOpen) {
            form.reset({
                name: selectedCity?.name || "",
                regionId: selectedCity?.regionId || undefined,
            });
            setFormError(null);
        }
    }, [selectedCity, isAddEditDialogOpen, form, setFormError]);

    function handleSubmit(data: FormValues) {
        if (selectedCity?.id) {
            updateMutation.mutate({ id: selectedCity.id, data });
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
                        {isEditing ? "Modifier la ville" : "Ajouter une ville"}
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
                                            placeholder="Nom de la ville"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="regionId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Région</FormLabel>
                                    <Select
                                        disabled={isLoadingRegions}
                                        value={field.value?.toString()}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez une région" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {isLoadingRegions && (
                                                <SelectItem
                                                    disabled
                                                    value="loading"
                                                >
                                                    Chargement...
                                                </SelectItem>
                                            )}
                                            {regionsError && (
                                                <SelectItem
                                                    disabled
                                                    value="error"
                                                >
                                                    Erreur de chargement
                                                </SelectItem>
                                            )}
                                            {Array.isArray(regions) &&
                                                regions
                                                    .filter(
                                                        (region) =>
                                                            region.id !==
                                                            undefined
                                                    )
                                                    .map((region) => (
                                                        <SelectItem
                                                            key={region.id}
                                                            value={region.id!.toString()}
                                                        >
                                                            {region.name}
                                                        </SelectItem>
                                                    ))}
                                        </SelectContent>
                                    </Select>
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
