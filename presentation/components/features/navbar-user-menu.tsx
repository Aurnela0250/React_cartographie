"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";

import { triggerSessionUpdate } from "@/presentation/providers/session-provider";
import { Button } from "@/presentation/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import UserAvatar from "@/presentation/components/user-avatar";

interface NavbarUserMenuProps {
    user: {
        id: number;
        email: string;
        active: boolean;
        isAdmin: boolean;
    };
}

export default function NavbarUserMenu({ user }: NavbarUserMenuProps) {
    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                // Déclencher le refresh de session pour tous les onglets
                triggerSessionUpdate();
                window.location.href = "/login";
            }
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="relative size-8 rounded-full"
                    variant="ghost"
                >
                    <UserAvatar email={user.email} image={undefined} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent forceMount align="end">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user.email.split("@")[0]}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile">Mon profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/favorites">Mes favoris</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 size-4" />
                    Se déconnecter
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
