"use client";

import { LogOut } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import { useAuth } from "@/presentation/hooks/use-auth";

interface LogoutButtonProps {
    variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
    size?: "default" | "sm" | "lg" | "icon";
    showIcon?: boolean;
    showText?: boolean;
    className?: string;
}

export function LogoutButton({
    variant = "ghost",
    size = "default",
    showIcon = true,
    showText = true,
    className,
}: LogoutButtonProps) {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    return (
        <Button
            className={className}
            size={size}
            variant={variant}
            onClick={handleLogout}
        >
            {showIcon && (
                <LogOut className={showText ? "mr-2 size-4" : "size-4"} />
            )}
            {showText && "Se déconnecter"}
        </Button>
    );
}
