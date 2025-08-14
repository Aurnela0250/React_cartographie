"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Dialog, DialogContent } from "@/presentation/components/ui/dialog";

const navigation = [
    { name: "Accueil", href: "#" },
    { name: "Établissements", href: "#" },
    { name: "À propos", href: "#" },
    { name: "Contact", href: "#" },
];

export default function HomePage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="bg-gradient-to-br from-white to-green-50">
            <header className="absolute inset-x-0 top-0 z-50">
                <nav
                    aria-label="Global"
                    className="flex items-center justify-between p-6 lg:px-8"
                >
                    <div className="flex lg:flex-1">
                        <a className="-m-1.5 p-1.5" href="#">
                            <span className="sr-only">Orientation Mada</span>
                            <div className="text-xl font-[var(--font-inter)] font-bold text-green-600">
                                Orientation Mada
                            </div>
                        </a>
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <Menu aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                className="text-sm/6 font-[var(--font-inter)] font-semibold text-gray-900"
                                href={item.href}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <a
                            className="text-sm/6 font-[var(--font-inter)] font-semibold text-gray-900"
                            href="#"
                        >
                            Connexion <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </nav>
                <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <DialogContent
                        className="fixed inset-y-0 right-0 z-50 size-full max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 lg:hidden"
                        onEscapeKeyDown={() => setMobileMenuOpen(false)}
                        onPointerDownOutside={() => setMobileMenuOpen(false)}
                    >
                        <div className="flex items-center justify-between">
                            <a className="-m-1.5 p-1.5" href="#">
                                <span className="sr-only">
                                    Orientation Mada
                                </span>
                                <div className="text-xl font-[var(--font-inter)] font-bold text-green-600">
                                    Orientation Mada
                                </div>
                            </a>
                            <button
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <X aria-hidden="true" className="size-6" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {navigation.map((item) => (
                                        <a
                                            key={item.name}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-[var(--font-inter)] font-semibold text-gray-900 hover:bg-gray-50"
                                            href={item.href}
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                                <div className="py-6">
                                    <a
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-[var(--font-inter)] font-semibold text-gray-900 hover:bg-gray-50"
                                        href="#"
                                    >
                                        Connexion
                                    </a>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                >
                    <div
                        className="aspect-1155/678 w-144.5 rotate-30 bg-linear-to-tr sm:w-288.75 relative left-[calc(50%-11rem)] -translate-x-1/2 from-green-100 to-green-200 opacity-30 sm:left-[calc(50%-30rem)]"
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                    />
                </div>
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm/6 font-[var(--font-inter)] text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                            Nouveau guide d'orientation 2024 disponible.{" "}
                            <a
                                className="font-semibold text-green-600"
                                href="#"
                            >
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-0"
                                />
                                Télécharger{" "}
                                <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-balance text-5xl font-[var(--font-inter)] font-semibold tracking-tight text-gray-900 sm:text-7xl">
                            Trouvez votre établissement idéal à Madagascar
                        </h1>
                        <p className="mt-8 text-pretty text-lg font-[var(--font-inter)] font-medium text-gray-500 sm:text-xl/8">
                            Découvrez plus de 500 établissements d'enseignement
                            supérieur et professionnel à travers Madagascar.
                            Consultez les programmes, campus, et modalités
                            d'admission.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a
                                className="shadow-xs rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-[var(--font-inter)] font-semibold text-white hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                href="#"
                            >
                                Explorer les établissements
                            </a>
                            <a
                                className="text-sm/6 font-[var(--font-inter)] font-semibold text-gray-900"
                                href="#"
                            >
                                Guide d'orientation{" "}
                                <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                >
                    <div
                        className="aspect-1155/678 w-144.5 bg-linear-to-tr sm:w-288.75 relative left-[calc(50%+3rem)] -translate-x-1/2 from-green-100 to-green-200 opacity-30 sm:left-[calc(50%+36rem)]"
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
