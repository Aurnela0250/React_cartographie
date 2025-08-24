"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import { requestOtpAction } from "@/core/actions/auth/request-otp.action";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";

import { GoogleSignInButton } from "../../_components/google-sign-in-button";
import OtpForm from "../../_components/otp-form";

export default function SignInForm() {
    const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [error, setError] = useState("");

    const [state, formAction, isPending] = useActionState(
        async (_prevState: any, formData: FormData) => {
            try {
                setError("");
                const email = formData.get("email") as string;
                const result = await requestOtpAction(formData);

                setUserEmail(email);
                setIsOtpDialogOpen(true);

                return result;
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "An error occurred";
                setError(errorMessage);
                return { message: "", expiresInMinutes: 0 };
            }
        },
        { message: "", expiresInMinutes: 0 }
    );
    return (
        <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
            <form action={formAction} className="m-auto h-fit w-full max-w-92">
                <div className="p-6">
                    <div>
                        <Link
                            href="/"
                            aria-label="home"
                            className="flex items-center space-x-2"
                        >
                            <span className="sr-only">Orientation Mada</span>
                            <div className="text-primary text-xl font-bold">
                                Orientation Mada
                            </div>
                        </Link>
                        <h1 className="mt-4 mb-1 text-xl font-semibold">
                            S'inscrire
                        </h1>
                        <p>Bienvenue ! Créez un compte pour commencer.</p>
                    </div>

                    <div className="mt-6">
                        <GoogleSignInButton />
                    </div>

                    <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <hr className="border-dashed" />
                        <span className="text-muted-foreground text-xs">
                            Ou continuer avec
                        </span>
                        <hr className="border-dashed" />
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="block text-sm">
                                Email
                            </Label>
                            <Input
                                type="email"
                                required
                                name="email"
                                id="email"
                            />
                        </div>

                        {error && (
                            <p
                                className="text-destructive text-sm"
                                role="alert"
                            >
                                {error}
                            </p>
                        )}

                        {state.message && !error && (
                            <p className="text-sm text-green-600" role="alert">
                                {state.message}
                            </p>
                        )}

                        <Button className="w-full" disabled={isPending}>
                            {isPending ? "Sending..." : "Continue"}
                        </Button>
                    </div>
                </div>

                <p className="text-accent-foreground text-center text-sm">
                    Vous avez déjà un compte ?
                    <Button asChild variant="link" className="px-2">
                        <Link href="/sign-in">Se connecter</Link>
                    </Button>
                </p>
            </form>

            <OtpForm
                isOpen={isOtpDialogOpen}
                onOpenChangeAction={setIsOtpDialogOpen}
                userEmail={userEmail}
            />
        </section>
    );
}
