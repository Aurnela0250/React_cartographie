"use client";

import { LogOut } from "lucide-react";

import { signOutAction } from "@/core/actions/auth/sign-out.action";
import { Button } from "@/presentation/components/ui/button";

interface LogoutButtonProps {
    children?: React.ReactNode;
    className?: string;
    showIcon?: boolean;
    variant?: "default" | "menu-item";
    onClick?: () => void;
}

/**
 * Composant bouton de déconnexion centralisé
 * Utilise l'action sign-out.action.ts pour gérer la déconnexion
 */
export default function LogoutButton({
    children = "Se déconnecter",
    className = "",
    showIcon = true,
    variant = "default",
    onClick,
}: LogoutButtonProps) {
    const handleLogout = async () => {
        try {
            // Appeler la fonction de callback si fournie
            if (onClick) {
                onClick();
            }

            // Utiliser l'action centralisée pour la déconnexion
            await signOutAction();
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    if (variant === "menu-item") {
        return (
            <Button
                variant="ghost"
                className={`flex h-auto w-full items-center justify-start gap-2 py-1.5 text-left ${className}`}
                onClick={handleLogout}
            >
                {showIcon && <LogOut className="mr-2 size-4" />}
                {children}
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            className={`flex items-center gap-2 ${className}`}
            onClick={handleLogout}
        >
            {showIcon && <LogOut className="mr-2 size-4" />}
            {children}
        </Button>
    );
}
