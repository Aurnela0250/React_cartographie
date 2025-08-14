"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/presentation/components/ui/button";
import { Checkbox } from "@/presentation/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/presentation/components/ui/form";
import { Input } from "@/presentation/components/ui/input";
import { LoginInput, loginSchema } from "@/presentation/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormError } from "./form-error-message";

interface LoginResponse {
    success: boolean;
    redirectTo?: string;
    error?: string;
    user?: {
        id: number;
        email: string;
        active: boolean;
        isAdmin: boolean;
    };
}

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [showPassword, setShowPassword] = React.useState(false);
    const [isPending, setIsPending] = React.useState(false);

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginInput) => {
        setErrorMessage(null);
        setIsPending(true);

        try {
            // Récupérer le paramètre redirectTo depuis l'URL
            const redirectTo = searchParams.get("redirectTo");

            // Construire l'URL avec les paramètres de redirection
            const loginUrl = new URL("/api/auth/login", window.location.origin);

            if (redirectTo) {
                loginUrl.searchParams.set("redirectTo", redirectTo);
            }

            const response = await fetch(loginUrl.toString(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result: LoginResponse = await response.json();

            if (!result.success || !response.ok) {
                setErrorMessage(
                    result.error ||
                        "Une erreur est survenue lors de la connexion"
                );

                return;
            }

            // Connexion réussie
            console.log("Utilisateur connecté:", result.user);

            // Utiliser l'URL de redirection fournie par l'API ou redirection par défaut selon le rôle
            const redirectPath =
                result.redirectTo || (result.user?.isAdmin ? "/admin" : "/");

            router.push(redirectPath);
            router.refresh();
        } catch (error) {
            console.error("Erreur de connexion:", error);
            setErrorMessage("Une erreur est survenue lors de la connexion");
        } finally {
            setIsPending(false);
        }
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
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
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
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="********"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                        />
                                        <button
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            tabIndex={-1}
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="size-4" />
                                            ) : (
                                                <Eye className="size-4" />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" />
                            <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="remember"
                            >
                                Se souvenir de moi
                            </label>
                        </div>
                        <Link
                            className="text-sm text-primary hover:underline"
                            href="/forgot-password"
                        >
                            Mot de passe oublié?
                        </Link>
                    </div>

                    <FormError message={errorMessage} />

                    <Button
                        className="w-full"
                        disabled={isPending}
                        type="submit"
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
                En vous connectant, vous acceptez nos{" "}
                <Link className="hover:underline" href="/terms-of-service">
                    Conditions d'utilisation
                </Link>{" "}
                et notre{" "}
                <Link className="hover:underline" href="/privacy-policy">
                    Politique de confidentialité
                </Link>
                .
            </div>
        </div>
    );
}
