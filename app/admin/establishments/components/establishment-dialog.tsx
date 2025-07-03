"use client";

import { useMemo } from "react";
import { Save, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { City } from "@/core/entities/city.entity";
import { EstablishmentType } from "@/core/entities/establishment-type.entity";
import { PaginatedResult } from "@/core/entities/pagination";
import {
    createEstablishment,
    updateEstablishment,
} from "@/infrastructure/server-actions/establishment.action";
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

import { useEstablishmentStore } from "./establishment-store";

const formSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    acronym: z.string().optional(),
    address: z.string().min(1, "L'adresse est requise"),
    contacts: z.array(
        z.object({
            value: z.string().min(1, "Le contact ne peut pas être vide"),
        })
    ),
    website: z.string().optional(),
    description: z.string().optional(),
    latitude: z
        .string()
        .optional()
        .refine((val) => !val || /^-?\d*(\.?\d*)?$/.test(val), {
            message: "La latitude doit être un nombre valide",
        }),
    longitude: z
        .string()
        .optional()
        .refine((val) => !val || /^-?\d*(\.?\d*)?$/.test(val), {
            message: "La longitude doit être un nombre valide",
        }),
    establishmentTypeId: z.coerce.number().min(1, "Le type est requis"),
    cityId: z.coerce.number().min(1, "La ville est requise"),
});

type FormValues = z.infer<typeof formSchema>;
type MutationError =
    | { message?: string; statusCode?: number; name?: string }
    | unknown;

export function EstablishmentDialog() {
    const queryClient = useQueryClient();
    const {
        isAddEditDialogOpen,
        closeDialogs,
        selectedEstablishment,
        formError,
        setFormError,
    } = useEstablishmentStore();

    const defaultValues = useMemo(
        () => ({
            name: selectedEstablishment?.name || "",
            acronym: selectedEstablishment?.acronym || "",
            address: selectedEstablishment?.address || "",
            contacts:
                selectedEstablishment?.contacts?.map((c) => ({ value: c })) ||
                [],
            website: selectedEstablishment?.website || "",
            description: selectedEstablishment?.description || "",
            latitude:
                selectedEstablishment?.latitude !== undefined &&
                selectedEstablishment?.latitude !== null
                    ? String(selectedEstablishment.latitude)
                    : "",
            longitude:
                selectedEstablishment?.longitude !== undefined &&
                selectedEstablishment?.longitude !== null
                    ? String(selectedEstablishment.longitude)
                    : "",
            establishmentTypeId:
                selectedEstablishment?.establishmentTypeId || 0,
            cityId: selectedEstablishment?.cityId || 0,
        }),
        [selectedEstablishment]
    );

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        values: defaultValues,
    });

    const { control } = form;
    const {
        fields: contactFields,
        append: appendContact,
        remove: removeContact,
    } = useFieldArray({
        control,
        name: "contacts",
    });

    // Récupération des types et secteurs pour la liste déroulante
    const { data: types, isLoading: isTypesLoading } = useQuery({
        queryKey: ["establishment-types", "all"],
        queryFn: async () => {
            const res = await fetchWithAutoRefresh(
                "/api/establishment-types?page=1&per_page=100"
            );
            const json = await res.json();

            const responseData = PaginatedResult.fromJson(
                json,
                EstablishmentType
            );

            return responseData.items || [];
        },
    });
    const { data: cities, isLoading: isCitiesLoading } = useQuery({
        queryKey: ["cities", "all"],
        queryFn: async () => {
            const res = await fetchWithAutoRefresh(
                "/api/cities?page=1&per_page=100"
            );
            const json = await res.json();

            const responseData = PaginatedResult.fromJson(json, City);

            return responseData.items || [];
        },
    });

    const isEditing = !!selectedEstablishment?.id;

    const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["establishments"] });
        closeDialogs();
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
                setFormError(err.message || "Cet établissement existe déjà.");

                return;
            }
        }
        setFormError("Une erreur est survenue.");
    };

    const createMutation = useMutation({
        mutationFn: createEstablishment,
        onSuccess: handleSuccess,
        onError: handleError,
    });
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            updateEstablishment(id, data),
        onSuccess: handleSuccess,
        onError: handleError,
    });

    function handleSubmit(data: FormValues) {
        // Convertir latitude et longitude en nombres avant la soumission
        const formattedData = {
            ...data,
            contacts: data.contacts.map((c) => c.value),
            acronym: data.acronym,
            latitude: data.latitude ? Number(data.latitude) : undefined,
            longitude: data.longitude ? Number(data.longitude) : undefined,
        };

        delete formattedData.acronym;
        if (selectedEstablishment?.id) {
            updateMutation.mutate({
                id: selectedEstablishment.id,
                data: formattedData,
            });
        } else {
            createMutation.mutate(formattedData);
        }
    }

    return (
        <Dialog open={isAddEditDialogOpen} onOpenChange={closeDialogs}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? "Modifier l'établissement"
                            : "Ajouter un établissement"}
                    </DialogTitle>
                </DialogHeader>
                {formError && (
                    <div className="mb-2 rounded-md bg-destructive/15 p-3 text-center text-destructive">
                        {formError}
                    </div>
                )}
                <Form {...form}>
                    <form
                        className="grid grid-cols-1 gap-4 md:grid-cols-2"
                        onSubmit={form.handleSubmit(handleSubmit)}
                    >
                        {/* Colonne 1 */}
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nom de l'établissement"
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
                                                placeholder="Acronyme"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adresse</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Adresse"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormLabel>Contacts (téléphone/email)</FormLabel>
                            {contactFields.map((item, idx) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-2"
                                >
                                    <FormField
                                        control={form.control}
                                        name={`contacts.${idx}.value`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        placeholder={`Contact #${idx + 1}`}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        size="icon"
                                        title="Supprimer ce contact"
                                        type="button"
                                        variant="destructive"
                                        onClick={() => removeContact(idx)}
                                    >
                                        -
                                    </Button>
                                </div>
                            ))}
                            <Button
                                className="mt-2"
                                type="button"
                                variant="outline"
                                onClick={() => appendContact({ value: "" })}
                            >
                                Ajouter un contact
                            </Button>
                        </div>
                        {/* Colonne 2 */}
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Site web</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="URL du site web"
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
                            <div className="flex gap-4">
                                <FormField
                                    control={form.control}
                                    name="latitude"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Latitude</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Latitude"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="longitude"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Longitude</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Longitude"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="establishmentTypeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Type d'établissement
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                disabled={isTypesLoading}
                                                value={
                                                    field.value &&
                                                    field.value !== 0
                                                        ? String(field.value)
                                                        : ""
                                                }
                                                onValueChange={(val) =>
                                                    field.onChange(
                                                        val === ""
                                                            ? 0
                                                            : Number(val)
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={
                                                            isTypesLoading
                                                                ? "Chargement..."
                                                                : "Sélectionner un type"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Array.isArray(types) &&
                                                    types.length > 0 ? (
                                                        types.map(
                                                            (type: {
                                                                id: number;
                                                                name: string;
                                                            }) => (
                                                                <SelectItem
                                                                    key={
                                                                        type.id
                                                                    }
                                                                    value={String(
                                                                        type.id
                                                                    )}
                                                                >
                                                                    {type.name}
                                                                </SelectItem>
                                                            )
                                                        )
                                                    ) : (
                                                        <SelectItem
                                                            disabled
                                                            value="_empty"
                                                        >
                                                            Aucun type
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cityId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Secteur</FormLabel>
                                        <FormControl>
                                            <Select
                                                disabled={isCitiesLoading}
                                                value={
                                                    field.value &&
                                                    field.value !== 0
                                                        ? String(field.value)
                                                        : ""
                                                }
                                                onValueChange={(val) =>
                                                    field.onChange(
                                                        val === ""
                                                            ? 0
                                                            : Number(val)
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={
                                                            isCitiesLoading
                                                                ? "Chargement..."
                                                                : "Sélectionner une ville"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Array.isArray(cities) &&
                                                    cities.length > 0 ? (
                                                        cities.map(
                                                            (city: City) => (
                                                                <SelectItem
                                                                    key={
                                                                        city.id
                                                                    }
                                                                    value={String(
                                                                        city.id
                                                                    )}
                                                                >
                                                                    {city.name}
                                                                </SelectItem>
                                                            )
                                                        )
                                                    ) : (
                                                        <SelectItem
                                                            disabled
                                                            value="_empty"
                                                        >
                                                            Aucune ville
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* Footer sur 2 colonnes */}
                        <div className="mt-4 flex justify-end gap-2 md:col-span-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeDialogs}
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
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
