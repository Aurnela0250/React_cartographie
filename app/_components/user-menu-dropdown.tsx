"use client";

import Link from "next/link";

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
import LogoutButton from "@/app/_components/logout-button";

interface UserMenuDropdownProps {
    user: {
        id: number;
        email: string;
        active: boolean;
        isAdmin: boolean;
    };
}



/**
 * Composant pour afficher le nom d'utilisateur formaté
 */
interface UserDisplayNameProps {
    email: string;
}

function UserDisplayName({ email }: UserDisplayNameProps) {
    const displayName = email.split("@")[0];
    
    return (
        <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
                {displayName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
                {email}
            </p>
        </div>
    );
}

/**
 * Composant pour les éléments du menu utilisateur
 */
function UserMenuItems() {
    return (
        <>
            <DropdownMenuItem asChild>
                <Link href="/profile">Mon profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href="/favorites">Mes favoris</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <LogoutButton variant="menu-item" />
            </DropdownMenuItem>
        </>
    );
}

/**
 * Composant client pour le menu déroulant utilisateur
 * Contient toute la logique d'interface utilisateur
 */
export default function UserMenuDropdown({ user }: UserMenuDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="relative size-8 rounded-full"
                    variant="ghost"
                    aria-label="Menu utilisateur"
                >
                    <UserAvatar email={user.email} image={undefined} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent forceMount align="end">
                <DropdownMenuLabel className="font-normal">
                    <UserDisplayName email={user.email} />
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <UserMenuItems />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}