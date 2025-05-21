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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/presentation/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    intitule: z.string().min(1, "L'intitulé est requis"),
    description: z.string().optional(),
    duration: z.coerce.number().min(1, "Durée requise"),
    levelId: z.coerce.number().min(1, "Niveau requis"),
    mentionId: z.coerce.number().min(1, "Mention requise"),
    authorizationId: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function FormationsDialog(props: {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: FormValues) => void;
    initialData?: Partial<FormValues>;
    error?: string | null;
    levels: { id: number; name: string }[];
    mentions: { id: number; name: string }[];
}) {
    const { open, onClose, onSubmit, initialData, error, levels, mentions } =
        props;
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            intitule: initialData?.intitule ?? "",
            description: initialData?.description ?? "",
            duration: initialData?.duration ?? 1,
            levelId: initialData?.levelId ?? levels[0]?.id ?? 1,
            mentionId: initialData?.mentionId ?? mentions[0]?.id ?? 1,
            authorizationId: initialData?.authorizationId ?? undefined,
        },
    });

    useEffect(() => {
        if (initialData && open) {
            form.reset({
                intitule: initialData.intitule ?? "",
                description: initialData.description ?? "",
                duration: initialData.duration ?? 1,
                levelId: initialData.levelId ?? levels[0]?.id ?? 1,
                mentionId: initialData.mentionId ?? mentions[0]?.id ?? 1,
                authorizationId: initialData.authorizationId ?? undefined,
            });
        }
        if (!open) {
            form.reset({
                intitule: "",
                description: "",
                duration: 1,
                levelId: levels[0]?.id ?? 1,
                mentionId: mentions[0]?.id ?? 1,
                authorizationId: undefined,
            });
        }
    }, [initialData, form, levels, mentions, open]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {initialData
                            ? "Modifier la formation"
                            : "Ajouter une formation"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="space-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="intitule"
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
                                                    value={level.id.toString()}
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
                                                    value={mention.id.toString()}
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
                                    <FormLabel>
                                        Autorisation (optionnel)
                                    </FormLabel>
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
