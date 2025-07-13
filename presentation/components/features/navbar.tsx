import Link from "next/link";

import { auth } from "@/lib/auth";
import Logo from "@/presentation/components/features/logo";
import { Button } from "@/presentation/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/presentation/components/ui/navigation-menu";

import NavbarMobileMenu from "./navbar-mobile-menu";
import NavbarUserMenu from "./navbar-user-menu";

// Navigation links array
const navigationLinks = [
    { href: "/", label: "Accueil" },
    { href: "/establishments", label: "Établissements" },
    { href: "/map", label: "Carte" },
];

/**
 * Navbar Server Component - Rendu côté serveur uniquement
 * Utilise auth() pour récupérer la session de manière élégante
 *
 * Avantages:
 * - Pas de flash de contenu non-authentifié
 * - SEO-friendly
 * - Performance optimale
 * - Pas de JavaScript côté client pour l'authentification
 */
export default async function Navbar() {
    // Récupérer la session côté serveur avec auth()
    const session = await auth();

    return (
        <header className="border-b px-4 md:px-6">
            <div className="flex h-16 justify-between gap-4">
                {/* Left side */}
                <div className="flex gap-2">
                    {/* Mobile menu */}
                    <div className="flex items-center md:hidden">
                        <NavbarMobileMenu
                            isLoggedIn={!!session?.user}
                            navigationLinks={navigationLinks}
                            user={session?.user}
                        />
                    </div>

                    {/* Main nav */}
                    <div className="flex items-center gap-6">
                        <Link
                            className="text-primary hover:text-primary/90"
                            href="/"
                        >
                            <Logo />
                        </Link>

                        {/* Desktop Navigation menu */}
                        <NavigationMenu className="h-full *:h-full max-md:hidden">
                            <NavigationMenuList className="h-full gap-2">
                                {navigationLinks.map((link, index) => (
                                    <NavigationMenuItem
                                        key={index}
                                        className="h-full"
                                    >
                                        <NavigationMenuLink
                                            className="h-full justify-center rounded-none border-y-2 border-transparent border-b-primary py-1.5 font-medium text-muted-foreground hover:border-b-primary hover:bg-transparent hover:text-primary"
                                            href={link.href}
                                        >
                                            {link.label}
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2">
                    {!session?.user && (
                        <>
                            <Button
                                asChild
                                className="text-sm"
                                size="sm"
                                variant="ghost"
                            >
                                <Link href="/login">Connexion</Link>
                            </Button>
                            <Button asChild className="text-sm" size="sm">
                                <Link href="/register">Inscription</Link>
                            </Button>
                        </>
                    )}

                    {session?.user && <NavbarUserMenu user={session.user} />}
                </div>
            </div>
        </header>
    );
}
