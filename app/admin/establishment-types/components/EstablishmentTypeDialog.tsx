import { useEffect } from "react";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { EstablishmentType } from "@/core/domain/entities/establishment-type.entity";
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

const formSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function EstablishmentTypeDialog({
    open,
    onClose,
    onSubmit,
    initialData,
    error,
}: {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; description?: string | null }) => void;
    initialData?: Partial<EstablishmentType>;
    error?: string | null;
}) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
        },
    });

    // Réinitialiser le formulaire à chaque ouverture/fermeture ou soumission
    useEffect(() => {
        if (!open) {
            form.reset({ name: "", description: "" });
        } else {
            form.reset({
                name: initialData?.name || "",
                description: initialData?.description || "",
            });
        }
    }, [open, initialData, form]);

    // Vider le formulaire après soumission
    const handleSubmit = (values: FormValues) => {
        onSubmit(values);
        form.reset({ name: "", description: "" });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Type d'établissement</DialogTitle>
                </DialogHeader>
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
                        {error && (
                            <div className="mt-2 text-destructive">{error}</div>
                        )}
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                <X className="mr-2 size-4" /> Annuler
                            </Button>
                            <Button type="submit">
                                <Save className="mr-2 size-4" /> Enregistrer
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
