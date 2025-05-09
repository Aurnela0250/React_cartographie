"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";

import { login } from "@/infrastructure/server-actions/login.action";
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

export function LoginForm() {
    const router = useRouter();
    const { executeAsync, isPending } = useAction(login);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [showPassword, setShowPassword] = React.useState(false);
    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginInput) => {
        setErrorMessage(null);
        const result = await executeAsync(data);

        // Vérification du résultat pour les erreurs
        if (
            result?.data &&
            result.data.success === false &&
            result.data.error
        ) {
            setErrorMessage(result.data.error);

            return;
        }

        // Si le résultat contient des données de succès et une URL de redirection
        if (result?.data && result.data.success === true) {
            router.push(result.data.redirectTo || "/");
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
