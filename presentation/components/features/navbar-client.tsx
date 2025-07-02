"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Search, X } from "lucide-react";

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

export function NavbarClient() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoggedIn } = useSession();
    const [showSearch, setShowSearch] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                router.push("/login");
                router.refresh();
            }
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            {/* Menu mobile */}
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
                        {/* Navigation mobile */}
                    </SheetContent>
                </Sheet>
            </div>

            {/* Barre de recherche */}
            {showSearch ? (
                <div className="flex items-center gap-2">
                    <Input
                        className="h-9 w-[300px]"
                        placeholder="Rechercher..."
                        onBlur={() => setShowSearch(false)}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") {
                                setShowSearch(false);
                            }
                        }}
                    />
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowSearch(false)}
                    >
                        <X className="size-4" />
                    </Button>
                </div>
            ) : (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSearch(true)}
                >
                    <Search className="size-4" />
                    <span className="sr-only">Rechercher</span>
                </Button>
            )}

            {/* Notifications */}
            {isLoggedIn && (
                <Button size="sm" variant="ghost">
                    <Bell className="size-4" />
                    <span className="sr-only">Notifications</span>
                </Button>
            )}

            {/* Menu utilisateur */}
            {isLoggedIn ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="relative size-8 rounded-full"
                            variant="ghost"
                        >
                            <UserAvatar
                                email={user?.email ?? "user@example.com"}
                                image={user?.avatar ?? undefined}
                            />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent forceMount align="end">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {user?.name ??
                                        user?.email?.split("@")[0] ??
                                        "Utilisateur"}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email ?? ""}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            disabled={isLoggingOut}
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 size-4" />
                            {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button asChild size="sm">
                    <a href="/login">Se connecter</a>
                </Button>
            )}
        </>
    );
}
