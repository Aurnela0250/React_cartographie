"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/presentation/components/ui/button";

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Fix hydration issue
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="sm" className="size-8 px-0">
                <Sun className="size-4" />
                <span className="sr-only">Basculer le thème</span>
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className="size-8 px-0"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
            {resolvedTheme === "dark" ? (
                <Sun className="size-4" />
            ) : (
                <Moon className="size-4" />
            )}
            <span className="sr-only">
                Basculer vers le mode {resolvedTheme === "dark" ? "clair" : "sombre"}
            </span>
        </Button>
    );
}