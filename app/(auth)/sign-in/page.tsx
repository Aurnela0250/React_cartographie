"use client";

import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
    return (
        <div className="flex h-screen w-full">
            {/* Partie gauche - Formulaire */}
            <div className="bg-background flex w-full flex-col items-center justify-center p-8 md:w-1/2">
                <LoginForm />
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
