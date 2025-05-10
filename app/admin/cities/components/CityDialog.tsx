import { useEffect } from "react";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { City } from "@/core/domain/entities/city.entity";
import { Region } from "@/core/domain/entities/region.entity";
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
import { useQuery } from "@tanstack/react-query";

const fetchRegions = async (): Promise<Region[]> => {
    const response = await fetch("/api/regions?per_page=100");

    if (!response.ok) {
        throw new Error("Failed to fetch regions");
    }

    const data = await response.json();

    console.log("Fetched regions:", data);

    // Si la réponse est paginée (ex: { items: Region[], ... }), retourner data.items
    if (Array.isArray(data)) {
        return data;
    } else if (Array.isArray(data.items)) {
        return data.items;
    } else {
        return [];
    }
};

const formSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    region_id: z.coerce
        .number({ invalid_type_error: "La région est requise" })
        .min(1, "La région est requise"),
});

type FormValues = z.infer<typeof formSchema>;

export function CityDialog({
    open,
    onClose,
    onSubmit,
    initialData,
    error,
}: {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; region_id: number }) => void;
    initialData?: Partial<City>;
    error?: string | null;
}) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            region_id: initialData?.regionId || undefined,
        },
    });

    const isEditing = !!initialData?.id;

    const {
        data: regions,
        isLoading: isLoadingRegions,
        error: regionsError,
    } = useQuery<Region[]>({
        queryKey: ["regions"],
        queryFn: fetchRegions,
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: initialData?.name || "",
                region_id: initialData?.regionId || undefined,
            });
        }
    }, [initialData, open, form]);

    function handleSubmit(data: FormValues) {
        onSubmit(data);
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? "Modifier la ville"
                            : "Ajouter une nouvelle ville"}
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
                            name="region_id"
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
                                onClick={onClose}
                            >
                                <X className="mr-2 size-4" /> Annuler
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
