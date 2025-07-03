"use client";

import { useParams } from "next/navigation";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Level } from "@/core/entities/level.entity";
import { Mention } from "@/core/entities/mention.entity";
import { PaginatedResult } from "@/core/entities/pagination";
import {
    createFormation,
    updateFormation,
} from "@/infrastructure/server-actions/formation.actions";
import { Button } from "@/presentation/components/ui/button";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/presentation/components/ui/select";
import { fetchWithAutoRefresh } from "@/shared/utils/fetch-with-refresh";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useFormationStore } from "./formation-store";

const formSchema = z.object({
    name: z.string().min(1, "L'intitulé est requis"),
    description: z.string().optional(),
    duration: z.coerce.number().min(1, "Durée requise"),
    levelId: z.coerce.number().min(1, "Niveau requis"),
    mentionId: z.coerce.number().min(1, "Mention requise"),
    authorizationId: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const fetchLevels = async (): Promise<PaginatedResult<Level>> => {
    const res = await fetchWithAutoRefresh("/api/levels?page=1&perPage=100");
    if (!res.ok) throw new Error("Failed to fetch levels");
    const json = await res.json();
    return PaginatedResult.fromJson(json, Level);
};

const fetchMentions = async (): Promise<PaginatedResult<Mention>> => {
    const res = await fetchWithAutoRefresh("/api/mentions?page=1&perPage=100");
    if (!res.ok) throw new Error("Failed to fetch mentions");
    const json = await res.json();
    return PaginatedResult.fromJson(json, Mention);
};

function FormationForm({ onClose }: { onClose: () => void }) {
    const { id: establishmentId } = useParams<{ id: string }>();
    const { selectedFormation, setFormError, formError } = useFormationStore();
    const queryClient = useQueryClient();

    const { data: levelsData } = useQuery<PaginatedResult<Level>>({
        queryKey: ["levels", "all"],
        queryFn: fetchLevels,
    });
    const levels = levelsData?.items ?? [];

    const { data: mentionsData } = useQuery<PaginatedResult<Mention>>({
        queryKey: ["mentions", "all"],
        queryFn: fetchMentions,
    });
    const mentions = mentionsData?.items ?? [];

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: selectedFormation
            ? {
                  name: selectedFormation.name ?? "",
                  description: selectedFormation.description ?? "",
                  duration: selectedFormation.duration ?? 1,
                  levelId: selectedFormation.levelId,
                  mentionId: selectedFormation.mentionId,
                  authorizationId: selectedFormation.authorizationId,
              }
            : {
                  name: "",
                  description: "",
                  duration: 1,
                  levelId: levels[0]?.id,
                  mentionId: mentions[0]?.id,
                  authorizationId: undefined,
              },
    });

    const createMutation = useMutation({
        mutationFn: (data: FormValues) =>
            createFormation({ ...data, establishmentId: +establishmentId }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["formations", establishmentId],
            });
            onClose();
        },
        onError: (err) => setFormError(err.message),
    });

    const updateMutation = useMutation({
        mutationFn: (data: FormValues) => {
            if (!selectedFormation?.id)
                throw new Error("ID de formation manquant");
            return updateFormation(selectedFormation.id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["formations", establishmentId],
            });
            onClose();
        },
        onError: (err) => setFormError(err.message),
    });

    const onSubmit = (data: FormValues) => {
        if (selectedFormation) {
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Intitulé</FormLabel>
                            <FormControl>
                                <Input {...field} />
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
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Durée (mois)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="levelId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Niveau</FormLabel>
                            <Select
                                value={field.value?.toString()}
                                onValueChange={(val) =>
                                    field.onChange(Number(val))
                                }
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un niveau" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {levels.map((level) => (
                                        <SelectItem
                                            key={level.id}
                                            value={level.id!.toString()}
                                        >
                                            {level.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="mentionId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mention</FormLabel>
                            <Select
                                value={field.value?.toString()}
                                onValueChange={(val) =>
                                    field.onChange(Number(val))
                                }
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une mention" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {mentions.map((mention) => (
                                        <SelectItem
                                            key={mention.id}
                                            value={mention.id!.toString()}
                                        >
                                            {mention.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="authorizationId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Autorisation (optionnel)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    {...field}
                                    value={field.value ?? ""}
                                />
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
                        {selectedFormation ? "Enregistrer" : "Créer"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export function FormationsDialog() {
    const {
        isAddEditDialogOpen,
        setIsAddEditDialogOpen,
        selectedFormation,
        setSelectedFormation,
        setFormError,
    } = useFormationStore();

    const handleClose = () => {
        setIsAddEditDialogOpen(false);
        setSelectedFormation(null);
        setFormError(null);
    };

    return (
        <Dialog open={isAddEditDialogOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {selectedFormation
                            ? "Modifier la formation"
                            : "Ajouter une formation"}
                    </DialogTitle>
                </DialogHeader>
                {isAddEditDialogOpen && (
                    <FormationForm
                        key={selectedFormation?.id ?? "new"}
                        onClose={handleClose}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
