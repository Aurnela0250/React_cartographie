import { useEffect } from "react";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Mention } from "@/core/domain/entities/mention.entity";
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
    domainId: z
        .number({ required_error: "Le domaine est requis" })
        .min(1, "Le domaine est requis"),
});

type FormValues = z.infer<typeof formSchema>;

export function MentionDialog({
    open,
    onClose,
    onSubmit,
    initialData,
    error,
}: {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; domainId: number }) => void;
    initialData?: Partial<Mention>;
    error?: string | null;
}) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            domainId: initialData?.domainId || 0,
        },
    });

    // Récupération des domaines pour la liste déroulante
    const { data: domains, isLoading: isDomainsLoading } = useQuery({
        queryKey: ["domains", "all"],
        queryFn: async () => {
            const res = await fetch("/api/domains?page=1&per_page=100");
            const json = await res.json();

            console.log("Domains", json);

            return json.items || [];
        },
    });

    const isEditing = !!initialData?.id;

    useEffect(() => {
        if (open) {
            form.reset({
                name: initialData?.name || "",
                domainId: initialData?.domainId || 0,
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
                            ? "Modifier la mention"
                            : "Ajouter une nouvelle mention"}
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
                                    <FormControl>
                                        <Select
                                            disabled={isDomainsLoading}
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
                                                        isDomainsLoading
                                                            ? "Chargement..."
                                                            : "Sélectionner un domaine"
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.isArray(domains) &&
                                                domains.length > 0 ? (
                                                    (
                                                        domains as Array<{
                                                            id: number;
                                                            name: string;
                                                        }>
                                                    ).map((domain) => (
                                                        <SelectItem
                                                            key={domain.id}
                                                            value={String(
                                                                domain.id
                                                            )}
                                                        >
                                                            {domain.name}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem
                                                        disabled
                                                        value="_empty"
                                                    >
                                                        Aucun domaine
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
