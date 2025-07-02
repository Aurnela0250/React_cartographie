import Link from "next/link";

import { ModeToggle } from "@/presentation/components/features/mode-toggle";

import { NavbarClient } from "./navbar-client";

// Version Server Component de la Navbar
export default function NavbarServer() {
    return (
        <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4">
                {/* Logo et navigation principale - Server */}
                <div className="mr-4 flex items-center gap-2">
                    <Link className="flex items-center gap-2" href="/">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary">
                            <span className="font-bold text-primary-foreground">
                                PS
                            </span>
                        </div>
                        <span className="hidden font-bold md:inline-block">
                            Parcours Sup
                        </span>
                    </Link>
                </div>

                {/* Navigation statique - Server */}
                <nav className="mx-6 hidden items-center gap-6 md:flex">
                    <Link
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        href="/"
                    >
                        Accueil
                    </Link>
                    <Link
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        href="/map"
                    >
                        Carte
                    </Link>
                    <Link
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        href="/establishments"
                    >
                        Établissements
                    </Link>
                </nav>

                <div className="ml-auto flex items-center gap-2">
                    <ModeToggle />
                    {/* Partie interactive - Client Component */}
                    <NavbarClient />
                </div>
            </div>
        </header>
    );
}
