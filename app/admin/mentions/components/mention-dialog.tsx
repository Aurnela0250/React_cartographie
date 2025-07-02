"use client";

import { useEffect } from "react";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
    createMention,
    updateMention,
} from "@/infrastructure/server-actions/mention.actions";
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

import { useMentionStore } from "./mention-store";

const formSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    domainId: z.coerce
        .number({ invalid_type_error: "Le domaine est requis" })
        .min(1, "Le domaine est requis"),
});

type FormValues = z.infer<typeof formSchema>;
type MutationError =
    | { message?: string; statusCode?: number; name?: string }
    | unknown;

export function MentionDialog() {
    const queryClient = useQueryClient();
    const {
        isAddEditDialogOpen,
        setIsAddEditDialogOpen,
        selectedMention,
        formError,
        setFormError,
        setSelectedMention,
    } = useMentionStore();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const isEditing = !!selectedMention?.id;

    const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["mentions"] });
        setIsAddEditDialogOpen(false);
        setFormError(null);
        setSelectedMention(null);
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
                setFormError(err.message || "Cette mention existe déjà.");

                return;
            }
        }
        setFormError("Une erreur est survenue.");
    };

    const createMutation = useMutation({
        mutationFn: createMention,
        onSuccess: handleSuccess,
        onError: handleError,
    });
    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: { name: string; domainId: number };
        }) => updateMention(id, data),
        onSuccess: handleSuccess,
        onError: handleError,
    });

    // Récupérer les domaines pour le select
    const {
        data: domains,
        isLoading: isLoadingDomains,
        error: domainsError,
    } = useQuery<{ id: number; name: string }[]>({
        queryKey: ["domains"],
        queryFn: async () => {
            const res = await fetch("/api/domains?page=1&per_page=100");
            const json = await res.json();

            return Array.isArray(json) ? json : json.items || [];
        },
    });

    useEffect(() => {
        if (isAddEditDialogOpen) {
            form.reset({
                name: selectedMention?.name || "",
                domainId: selectedMention?.domainId || undefined,
            });
            setFormError?.(null);
        }
    }, [selectedMention, isAddEditDialogOpen, form, setFormError]);

    function handleSubmit(data: FormValues) {
        if (selectedMention?.id) {
            updateMutation.mutate({ id: selectedMention.id, data });
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
                            ? "Modifier la mention"
                            : "Ajouter une mention"}
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
                                            placeholder="Nom de la mention"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="domainId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Domaine</FormLabel>
                                    <Select
                                        disabled={isLoadingDomains}
                                        value={field.value?.toString()}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez un domaine" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {isLoadingDomains && (
                                                <SelectItem
                                                    disabled
                                                    value="loading"
                                                >
                                                    Chargement...
                                                </SelectItem>
                                            )}
                                            {domainsError && (
                                                <SelectItem
                                                    disabled
                                                    value="error"
                                                >
                                                    Erreur de chargement
                                                </SelectItem>
                                            )}
                                            {Array.isArray(domains) &&
                                                domains
                                                    .filter(
                                                        (domain) =>
                                                            domain.id !==
                                                            undefined
                                                    )
                                                    .map((domain) => (
                                                        <SelectItem
                                                            key={domain.id}
                                                            value={domain.id!.toString()}
                                                        >
                                                            {domain.name}
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
