"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/presentation/contexts/user-context";
import { useToast } from "@/presentation/hooks/use-toast";

export default function LoginPage() {
    console.log("");
    const router = useRouter();
    const { toast } = useToast();
    const { login } = useUser();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast({
                title: "Erreur",
                description: "Veuillez remplir tous les champs",
                variant: "destructive",
            });

            return;
        }

        setIsLoading(true);

        try {
            await login(email, password);
            toast({
                title: "Connexion réussie",
                description: "Vous êtes maintenant connecté",
            });
            router.push("/");
        } catch (error) {
            toast({
                title: "Erreur de connexion",
                description: "Email ou mot de passe incorrect",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full">
            {/* Partie gauche - Formulaire */}
            <div className="bg-background flex w-full flex-col items-center justify-center p-8 md:w-1/2">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="mb-1 text-3xl font-bold">OrientaMada</h1>
                        <h2 className="mb-6 text-2xl font-semibold">
                            Connexion
                        </h2>
                        <p className="text-muted-foreground">
                            Vous n'avez pas de compte?{" "}
                            <a
                                className="text-primary hover:underline"
                                href="#"
                            >
                                Créer un compte
                            </a>
                        </p>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label
                                className="block text-sm font-medium"
                                htmlFor="email"
                            >
                                Adresse Email
                            </label>
                            <input
                                required
                                className="w-full rounded-md border border-input bg-background p-3"
                                id="email"
                                placeholder="exemple@email.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                className="block text-sm font-medium"
                                htmlFor="password"
                            >
                                Mot de passe
                            </label>
                            <input
                                required
                                className="w-full rounded-md border border-input bg-background p-3"
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    className="text-primary focus:ring-primary size-4 rounded border-gray-300"
                                    id="remember-me"
                                    type="checkbox"
                                />
                                <label
                                    className="ml-2 block text-sm text-muted-foreground"
                                    htmlFor="remember-me"
                                >
                                    Se souvenir de moi
                                </label>
                            </div>
                            <a
                                className="text-sm text-primary hover:underline"
                                href="#"
                            >
                                Mot de passe oublié?
                            </a>
                        </div>

                        <button
                            className={`flex w-full items-center justify-center rounded-md border border-transparent bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                                isLoading ? "cursor-not-allowed opacity-70" : ""
                            }`}
                            disabled={isLoading}
                            type="submit"
                        >
                            {isLoading ? (
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
                        </button>
                    </form>

                    <div className="text-muted-foreground mt-8 text-center text-xs">
                        <p>© 2025 OrientaMada. Tous droits réservés.</p>
                        <div className="mt-2 space-x-4">
                            <a className="hover:underline" href="#">
                                Conditions d'utilisation
                            </a>
                            <span>|</span>
                            <a className="hover:underline" href="#">
                                Politique de confidentialité
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Partie droite - Gradient et promotion */}
            <div
                className="hidden flex-col items-center justify-center p-8 text-white md:flex md:w-1/2"
                style={{
                    background:
                        "linear-gradient(to top left, #085078, #85D8CE)",
                }}
            >
                <div className="max-w-md text-center">
                    <div className="mb-8">
                        <svg
                            className="mx-auto mb-4 size-16"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                            />
                        </svg>
                        <h2 className="mb-2 text-2xl font-bold">
                            Découvrez OrientaMada
                        </h2>
                        <p className="text-lg">
                            La meilleure plateforme pour trouver votre
                            orientation académique à Madagascar
                        </p>
                    </div>

                    <div className="mb-8 rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                        <h3 className="mb-2 text-xl font-semibold">
                            Explorez les établissements
                        </h3>
                        <p className="mb-4">
                            Accédez à notre base de données complète
                            d'établissements d'enseignement supérieur à
                            Madagascar.
                        </p>
                        <button className="rounded-md bg-white px-4 py-2 font-medium text-[#085078] transition-colors hover:bg-white/90">
                            En savoir plus
                        </button>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <div className="flex items-center">
                            <svg
                                className="mr-1 size-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5 13l4 4L19 7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                />
                            </svg>
                            <span>+100 Établissements</span>
                        </div>
                        <div className="flex items-center">
                            <svg
                                className="mr-1 size-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5 13l4 4L19 7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                />
                            </svg>
                            <span>+500 Filières</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
