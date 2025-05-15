import { useEffect } from "react";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Sector } from "@/core/entities/sector.entity";
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

const formSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    cityId: z.number().min(1, "La ville est requise"),
});

type FormValues = z.infer<typeof formSchema>;

export function SectorDialog({
    open,
    onClose,
    onSubmit,
    initialData,
    error,
}: {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; cityId: number }) => void;
    initialData?: Partial<Sector>;
    error?: string | null;
}) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            cityId: initialData?.cityId || 0,
        },
    });

    // Récupération des villes pour la liste déroulante (en dehors du render du champ)
    const { data: cities, isLoading: isCitiesLoading } = useQuery({
        queryKey: ["cities", "all"],
        queryFn: async () => {
            const res = await fetch("/api/cities?page=1&per_page=100");
            const json = await res.json();

            return json.items || [];
        },
    });

    const isEditing = !!initialData?.id;

    useEffect(() => {
        if (open) {
            form.reset({
                name: initialData?.name || "",
                cityId: initialData?.cityId || 0,
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
                            ? "Modifier le secteur"
                            : "Ajouter un nouveau secteur"}
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
                                            placeholder="Nom du secteur"
                                            {...field}
                                        />
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
                                    <FormLabel>Ville</FormLabel>
                                    <FormControl>
                                        <Select
                                            disabled={isCitiesLoading}
                                            value={
                                                field.value && field.value !== 0
                                                    ? String(field.value)
                                                    : ""
                                            }
                                            onValueChange={(val) =>
                                                field.onChange(
                                                    val === "" ? 0 : Number(val)
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
                                                        (city: {
                                                            id: number;
                                                            name: string;
                                                        }) => (
                                                            <SelectItem
                                                                key={city.id}
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
                        <DialogFooter>
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
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
