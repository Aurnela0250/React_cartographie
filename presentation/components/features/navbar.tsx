"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Search, X } from "lucide-react";

// Nous utilisons maintenant un fetch direct vers l'API au lieu du server-action
import { ModeToggle } from "@/presentation/components/features/mode-toggle";
import { Button } from "@/presentation/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { Input } from "@/presentation/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/presentation/components/ui/sheet";
import { useSession } from "@/presentation/hooks/use-session";

import UserAvatar from "../user-avatar";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoggedIn } = useSession();
    const [showSearch, setShowSearch] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    return (
        <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4">
                <div className="mr-2 md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <Menu className="size-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            className="w-[240px] sm:w-[300px]"
                            side="left"
                        >
                            <nav className="mt-8 flex flex-col gap-4">
                                <Link
                                    className={`rounded-md px-2 py-1 ${pathname === "/" ? "bg-muted font-medium" : ""}`}
                                    href="/"
                                >
                                    Accueil
                                </Link>
                                <Link
                                    className={`rounded-md px-2 py-1 ${pathname === "/map" ? "bg-muted font-medium" : ""}`}
                                    href="/map"
                                >
                                    Carte
                                </Link>
                                <Link
                                    className={`rounded-md px-2 py-1 ${pathname === "/establishments" ? "bg-muted font-medium" : ""}`}
                                    href="/establishments"
                                >
                                    Établissements
                                </Link>
                                <Link
                                    className={`rounded-md px-2 py-1 ${pathname === "/chatbot" ? "bg-muted font-medium" : ""}`}
                                    href="/chatbot"
                                >
                                    Assistant IA
                                </Link>
                                <Link
                                    className={`rounded-md px-2 py-1 ${pathname === "/chatbot" ? "bg-muted font-medium" : ""}`}
                                    href="/admin"
                                >
                                    Admin
                                </Link>
                                {/* {user?.role !== "visitor" && (
                                    <Link
                                        className={`rounded-md px-2 py-1 ${pathname === "/dashboard" ? "bg-muted font-medium" : ""}`}
                                        href="/dashboard"
                                    >
                                        Tableau de bord
                                    </Link>
                                )} */}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

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

                <nav className="mx-6 hidden items-center gap-6 md:flex">
                    <Link
                        className={`text-sm font-medium ${
                            pathname === "/"
                                ? "text-foreground"
                                : "text-muted-foreground"
                        } transition-colors hover:text-foreground`}
                        href="/"
                    >
                        Accueil
                    </Link>
                    <Link
                        className={`text-sm font-medium ${
                            pathname === "/map"
                                ? "text-foreground"
                                : "text-muted-foreground"
                        } transition-colors hover:text-foreground`}
                        href="/map"
                    >
                        Carte
                    </Link>
                    <Link
                        className={`text-sm font-medium ${
                            pathname === "/establishments"
                                ? "text-foreground"
                                : "text-muted-foreground"
                        } transition-colors hover:text-foreground`}
                        href="/establishments"
                    >
                        Établissements
                    </Link>
                    <Link
                        className={`text-sm font-medium ${
                            pathname === "/chatbot"
                                ? "text-foreground"
                                : "text-muted-foreground"
                        } transition-colors hover:text-foreground`}
                        href="/chatbot"
                    >
                        Assistant IA
                    </Link>
                    <Link
                        className={`text-sm font-medium ${
                            pathname === "/chatbot"
                                ? "text-foreground"
                                : "text-muted-foreground"
                        } transition-colors hover:text-foreground`}
                        href="/admin"
                    >
                        Admin
                    </Link>
                    {/* {user?.role !== "visitor" && (
                        <Link
                            className={`text-sm font-medium ${
                                pathname === "/dashboard"
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            } transition-colors hover:text-foreground`}
                            href="/dashboard"
                        >
                            Tableau de bord
                        </Link>
                    )} */}
                </nav>

                <div className="ml-auto flex items-center gap-2">
                    {showSearch ? (
                        <div className="relative">
                            <Input
                                className="w-[200px] md:w-[300px]"
                                placeholder="Rechercher..."
                            />
                            <Button
                                className="absolute right-0 top-0"
                                size="icon"
                                variant="ghost"
                                onClick={() => setShowSearch(false)}
                            >
                                <X className="size-4" />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setShowSearch(true)}
                        >
                            <Search className="size-5" />
                            <span className="sr-only">Rechercher</span>
                        </Button>
                    )}
                    <ModeToggle />
                    <Button size="icon" variant="ghost">
                        <Bell className="size-5" />
                        <span className="sr-only">Notifications</span>
                    </Button>
                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className="relative size-8 rounded-full"
                                    variant="ghost"
                                >
                                    <UserAvatar email={user.email ?? "USER"} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <UserAvatar
                                            email={user.email ?? "USER"}
                                        />
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">
                                                {user?.name ?? "Utilisateur"}
                                            </span>
                                            <span className="truncate text-xs">
                                                {user?.email}
                                            </span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">Mon profil</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/favorites">Mes favoris</Link>
                                </DropdownMenuItem>
                                {/* {user.role !== "visitor" && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">
                                            Tableau de bord
                                        </Link>
                                    </DropdownMenuItem>
                                )} */}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <button
                                        className="flex w-full items-center"
                                        disabled={isLoggingOut}
                                        type="button"
                                        onClick={async () => {
                                            setIsLoggingOut(true);
                                            try {
                                                await fetch("/api/logout", {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type":
                                                            "application/json",
                                                    },
                                                });
                                            } catch (error) {
                                                console.error(
                                                    "Erreur lors de la déconnexion:",
                                                    error
                                                );
                                            } finally {
                                                // Toujours rediriger côté client, car fetch ne suit pas la redirection Next.js côté client
                                                router.push("/login");
                                                router.refresh();
                                                setIsLoggingOut(false);
                                            }
                                        }}
                                    >
                                        <LogOut className="mr-2 size-4" />
                                        <span>
                                            {isLoggingOut
                                                ? "Déconnexion..."
                                                : "Déconnexion"}
                                        </span>
                                    </button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {!isLoggedIn && (
                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost">
                                <Link href="/login">Connexion</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Inscription</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
