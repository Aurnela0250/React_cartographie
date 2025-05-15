import { useEffect } from "react";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    academicYear: z.coerce.number().min(2000, "Année invalide"),
    students: z.coerce.number().min(0, "Nombre d'étudiants requis"),
});

type FormValues = z.infer<typeof formSchema>;

export function AnnualHeadcountDialog(props: {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: FormValues) => void;
    initialData?: Partial<FormValues>;
    error?: string | null;
}) {
    const { open, onClose, onSubmit, initialData, error } = props;
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            academicYear: initialData?.academicYear ?? new Date().getFullYear(),
            students: initialData?.students ?? 0,
        },
    });

    useEffect(() => {
        if (initialData && open) {
            form.reset({
                academicYear:
                    initialData.academicYear ?? new Date().getFullYear(),
                students: initialData.students ?? 0,
            });
        }
        if (!open) {
            form.reset({
                academicYear: new Date().getFullYear(),
                students: 0,
            });
        }
    }, [initialData, form, open]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {initialData
                            ? "Modifier l'effectif annuel"
                            : "Ajouter un effectif annuel"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="space-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="academicYear"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Année universitaire</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="students"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre d'étudiants</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && (
                            <div className="text-sm text-destructive">
                                {error}
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                <X className="mr-2 size-4" /> Annuler
                            </Button>
                            <Button type="submit">
                                <Save className="mr-2 size-4" />
                                {initialData ? "Enregistrer" : "Créer"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
