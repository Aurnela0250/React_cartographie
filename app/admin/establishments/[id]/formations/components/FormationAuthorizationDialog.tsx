import { useEffect } from "react";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/presentation/components/ui/button";
import { Calendar } from "@/presentation/components/ui/calendar";
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/presentation/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/presentation/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";

const statusOptions = [
    { value: "REQUESTED", label: "En cours" },
    { value: "VALIDATED", label: "Validée" },
    { value: "REFUSED", label: "Refusée" },
    { value: "EXPIRED", label: "Expirée" },
];

const formSchema = z.object({
    dateDebut: z.string().min(4, "Date de début requise"),
    dateFin: z.string().optional(),
    status: z.enum(["REQUESTED", "VALIDATED", "REFUSED", "EXPIRED"], {
        required_error: "Statut requis",
    }),
    arrete: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function FormationAuthorizationDialog(props: {
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
            dateDebut: initialData?.dateDebut ?? "",
            dateFin: initialData?.dateFin ?? "",
            status: (initialData?.status as FormValues["status"]) ?? undefined,
            arrete: initialData?.arrete ?? "",
        },
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset({
                    dateDebut: initialData.dateDebut ?? "",
                    dateFin: initialData.dateFin ?? "",
                    status:
                        (initialData.status as FormValues["status"]) ??
                        undefined,
                    arrete: initialData.arrete ?? "",
                });
            }
        } else {
            form.reset({
                dateDebut: "",
                dateFin: "",
                status: undefined,
                arrete: "",
            });
        }
    }, [open, initialData, form]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {initialData
                            ? "Modifier l'autorisation"
                            : "Ajouter une autorisation"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="space-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="dateDebut"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date de début</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                className={
                                                    "w-full justify-start text-left font-normal" +
                                                    (field.value
                                                        ? ""
                                                        : " text-muted-foreground")
                                                }
                                                variant="outline"
                                            >
                                                {field.value
                                                    ? field.value
                                                    : "Sélectionner une date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                hideNavigation
                                                captionLayout="dropdown"
                                                className="rounded-lg border border-border bg-background p-2"
                                                classNames={{
                                                    month_caption: "mx-0",
                                                }}
                                                components={{
                                                    DropdownNav: (props) => (
                                                        <div className="flex w-full items-center gap-2">
                                                            {props.children}
                                                        </div>
                                                    ),
                                                    Dropdown: (props) => {
                                                        const handleCalendarChange =
                                                            (
                                                                value:
                                                                    | string
                                                                    | number,
                                                                onChange: React.ChangeEventHandler<HTMLSelectElement>
                                                            ) => {
                                                                const event = {
                                                                    target: {
                                                                        value: String(
                                                                            value
                                                                        ),
                                                                    },
                                                                } as React.ChangeEvent<HTMLSelectElement>;

                                                                onChange(event);
                                                            };

                                                        return (
                                                            <Select
                                                                value={String(
                                                                    props.value
                                                                )}
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    if (
                                                                        props.onChange
                                                                    ) {
                                                                        handleCalendarChange(
                                                                            value,
                                                                            props.onChange
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <SelectTrigger className="h-8 w-fit font-medium first:grow">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                                                                    {props.options?.map(
                                                                        (
                                                                            option
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    option.value
                                                                                }
                                                                                disabled={
                                                                                    option.disabled
                                                                                }
                                                                                value={String(
                                                                                    option.value
                                                                                )}
                                                                            >
                                                                                {
                                                                                    option.label
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        );
                                                    },
                                                }}
                                                defaultMonth={
                                                    field.value
                                                        ? new Date(field.value)
                                                        : new Date()
                                                }
                                                mode="single"
                                                selected={
                                                    field.value
                                                        ? new Date(field.value)
                                                        : undefined
                                                }
                                                startMonth={new Date(1980, 6)}
                                                onSelect={(date) => {
                                                    if (!date)
                                                        return field.onChange(
                                                            ""
                                                        );
                                                    // Corrige le décalage de fuseau pour obtenir la vraie date locale
                                                    const local = new Date(
                                                        date.getTime() -
                                                            date.getTimezoneOffset() *
                                                                60000
                                                    );

                                                    field.onChange(
                                                        local
                                                            .toISOString()
                                                            .slice(0, 10)
                                                    );
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dateFin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date de fin</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                className={
                                                    "w-full justify-start text-left font-normal" +
                                                    (field.value
                                                        ? ""
                                                        : " text-muted-foreground")
                                                }
                                                variant="outline"
                                            >
                                                {field.value
                                                    ? field.value
                                                    : "Sélectionner une date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                hideNavigation
                                                captionLayout="dropdown"
                                                className="rounded-lg border border-border bg-background p-2"
                                                classNames={{
                                                    month_caption: "mx-0",
                                                }}
                                                components={{
                                                    DropdownNav: (props) => (
                                                        <div className="flex w-full items-center gap-2">
                                                            {props.children}
                                                        </div>
                                                    ),
                                                    Dropdown: (props) => {
                                                        const handleCalendarChange =
                                                            (
                                                                value:
                                                                    | string
                                                                    | number,
                                                                onChange: React.ChangeEventHandler<HTMLSelectElement>
                                                            ) => {
                                                                const event = {
                                                                    target: {
                                                                        value: String(
                                                                            value
                                                                        ),
                                                                    },
                                                                } as React.ChangeEvent<HTMLSelectElement>;

                                                                onChange(event);
                                                            };

                                                        return (
                                                            <Select
                                                                value={String(
                                                                    props.value
                                                                )}
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    if (
                                                                        props.onChange
                                                                    ) {
                                                                        handleCalendarChange(
                                                                            value,
                                                                            props.onChange
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <SelectTrigger className="h-8 w-fit font-medium first:grow">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                                                                    {props.options?.map(
                                                                        (
                                                                            option
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    option.value
                                                                                }
                                                                                disabled={
                                                                                    option.disabled
                                                                                }
                                                                                value={String(
                                                                                    option.value
                                                                                )}
                                                                            >
                                                                                {
                                                                                    option.label
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        );
                                                    },
                                                }}
                                                defaultMonth={
                                                    field.value
                                                        ? new Date(field.value)
                                                        : new Date()
                                                }
                                                mode="single"
                                                selected={
                                                    field.value
                                                        ? new Date(field.value)
                                                        : undefined
                                                }
                                                startMonth={new Date(1980, 6)}
                                                onSelect={(date) => {
                                                    if (!date)
                                                        return field.onChange(
                                                            ""
                                                        );
                                                    const local = new Date(
                                                        date.getTime() -
                                                            date.getTimezoneOffset() *
                                                                60000
                                                    );

                                                    field.onChange(
                                                        local
                                                            .toISOString()
                                                            .slice(0, 10)
                                                    );
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Statut</FormLabel>
                                    <FormControl>
                                        <Select
                                            defaultValue={field.value}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionner un statut" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((opt) => (
                                                    <SelectItem
                                                        key={opt.value}
                                                        value={opt.value}
                                                    >
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="arrete"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Arrêté</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
