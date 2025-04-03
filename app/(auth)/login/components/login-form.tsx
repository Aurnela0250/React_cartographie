"use client";

import * as React from "react";
import Link from "next/link";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { login } from "@/app/actions/auth.actions";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/presentation/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export function LoginForm() {
    const [isPending, startTransition] = React.useTransition();
    const [state, formAction] = useFormState(login, {
        error: undefined,
        success: undefined,
    });

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: z.infer<typeof loginSchema>) => {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);

        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <div className="w-full max-w-md">
            <div className="mb-8">
                <h1 className="mb-1 text-3xl font-bold">OrientaMada</h1>
                <h2 className="mb-6 text-2xl font-semibold">Connexion</h2>
                <p className="text-muted-foreground">
                    Vous n'avez pas de compte?{" "}
                    <Link
                        className="text-primary hover:underline"
                        href="/register"
                    >
                        Créer un compte
                    </Link>
                </p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Adresse Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder="exemple@email.com"
                                        type="email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mot de passe</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder="********"
                                        type="password"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" />
                            <label
                                htmlFor="remember"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Se souvenir de moi
                            </label>
                        </div>
                        <Link
                            href="/forgot-password"
                            className="text-sm text-primary hover:underline"
                        >
                            Mot de passe oublié?
                        </Link>
                    </div>

                    <FormError message={state.error} />
                    <FormSuccess
                        message={
                            state.success ? "Connexion réussie!" : undefined
                        }
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <svg
                                    className="-ml-1 mr-3 size-5 animate-spin text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Connexion en cours...
                            </>
                        ) : (
                            "Se connecter"
                        )}
                    </Button>
                </form>
            </Form>

            <div className="mt-8 text-center text-xs text-muted-foreground">
                <p>© 2025 OrientaMada. Tous droits réservés.</p>
                <div className="mt-2 space-x-4">
                    <Link className="hover:underline" href="/terms">
                        Conditions d'utilisation
                    </Link>
                    <span>|</span>
                    <Link className="hover:underline" href="/privacy">
                        Politique de confidentialité
                    </Link>
                </div>
            </div>
        </div>
    );
}
