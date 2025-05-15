import { useEffect } from "react";
import { Save, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    acronyme: z.string().optional(),
    address: z.string().min(1, "L'adresse est requise"),
    contacts: z.array(z.string().min(1, "Le contact ne peut pas être vide")), // Permettre un tableau vide, mais les chaînes existantes ne peuvent pas être vides
    siteUrl: z.string().optional(),
    description: z.string().optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    establishmentTypeId: z.coerce.number().min(1, "Le type est requis"),
    sectorId: z.coerce.number().min(1, "Le secteur est requis"),
});

type FormValues = z.infer<typeof formSchema>;

export function EstablishmentDialog({
    open,
    onClose,
    onSubmit,
    initialData,
    error,
}: {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: FormValues) => void;
    initialData?: Partial<FormValues>;
    error?: string | null;
}) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            acronyme: initialData?.acronyme || "",
            address: initialData?.address || "",
            contacts: Array.isArray(initialData?.contacts)
                ? initialData.contacts
                : [], // Default to an empty array
            siteUrl: initialData?.siteUrl || "",
            description: initialData?.description || "",
            latitude: initialData?.latitude || undefined,
            longitude: initialData?.longitude || undefined,
            establishmentTypeId: initialData?.establishmentTypeId || 0,
            sectorId: initialData?.sectorId || 0,
        },
    });

    const { control } = form;
    const {
        fields: contactFields,
        append: appendContact,
        remove: removeContact,
    } = useFieldArray<FormValues, "contacts">({
        control,
        name: "contacts",
    });

    // Récupération des types et secteurs pour la liste déroulante
    const { data: types, isLoading: isTypesLoading } = useQuery({
        queryKey: ["establishment-types", "all"],
        queryFn: async () => {
            const res = await fetch(
                "/api/establishment-types?page=1&per_page=100"
            );
            const json = await res.json();

            return json.items || [];
        },
    });
    const { data: sectors, isLoading: isSectorsLoading } = useQuery({
        queryKey: ["sectors", "all"],
        queryFn: async () => {
            const res = await fetch("/api/sectors?page=1&per_page=100");
            const json = await res.json();

            return json.items || [];
        },
    });

    const isEditing = Boolean(
        initialData && "id" in initialData && initialData.id
    );

    useEffect(() => {
        if (open) {
            form.reset({
                name: initialData?.name || "",
                acronyme: initialData?.acronyme || "",
                address: initialData?.address || "",
                contacts: Array.isArray(initialData?.contacts)
                    ? initialData.contacts
                    : [], // Reset to an empty array if not provided or not an array
                siteUrl: initialData?.siteUrl || "",
                description: initialData?.description || "",
                latitude: initialData?.latitude || undefined,
                longitude: initialData?.longitude || undefined,
                establishmentTypeId: initialData?.establishmentTypeId || 0,
                sectorId: initialData?.sectorId || 0,
            });
        }
    }, [initialData, open, form]);

    function handleSubmit(data: FormValues) {
        onSubmit(data);
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? "Modifier l'établissement"
                            : "Ajouter un établissement"}
                    </DialogTitle>
                </DialogHeader>
                {error && (
                    <div className="mb-2 rounded-md bg-destructive/15 p-3 text-center text-destructive">
                        {error}
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
                                name="acronyme"
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
                                        name={`contacts.${idx}`}
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
                                onClick={() => appendContact("")}
                            >
                                Ajouter un contact
                            </Button>
                        </div>
                        {/* Colonne 2 */}
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="siteUrl"
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
                                                    type="number"
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
                                                    type="number"
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
                                name="sectorId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Secteur</FormLabel>
                                        <FormControl>
                                            <Select
                                                disabled={isSectorsLoading}
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
                                                            isSectorsLoading
                                                                ? "Chargement..."
                                                                : "Sélectionner un secteur"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Array.isArray(sectors) &&
                                                    sectors.length > 0 ? (
                                                        sectors.map(
                                                            (sector: {
                                                                id: number;
                                                                name: string;
                                                            }) => (
                                                                <SelectItem
                                                                    key={
                                                                        sector.id
                                                                    }
                                                                    value={String(
                                                                        sector.id
                                                                    )}
                                                                >
                                                                    {
                                                                        sector.name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )
                                                    ) : (
                                                        <SelectItem
                                                            disabled
                                                            value="_empty"
                                                        >
                                                            Aucun secteur
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
                                onClick={onClose}
                            >
                                <X className="mr-2 size-4" />
                                Annuler
                            </Button>
                            <Button type="submit" variant="default">
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
