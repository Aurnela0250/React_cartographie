"use client";

import { useEffect, useId, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Label } from "@/presentation/components/ui/label";
import {
    Switch,
    SwitchIndicator,
    SwitchWrapper,
} from "@/presentation/components/ui/switch";

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const id = useId();

    // Fix hydration issue
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex w-full items-center justify-between">
                <Label htmlFor={id}>Thème</Label>
                <SwitchWrapper permanent={true}>
                    <Switch
                        id={id}
                        size="lg"
                        checked={resolvedTheme === "dark"}
                    />
                    <SwitchIndicator state="on">
                        <Sun className="text-muted-foreground size-4" />
                    </SwitchIndicator>
                    <SwitchIndicator state="off">
                        <Moon className="text-muted-foreground size-4" />
                    </SwitchIndicator>
                </SwitchWrapper>
            </div>
        );
    }

    const handleThemeChange = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    return (
        <div className="flex w-full items-center justify-between">
            <Label htmlFor={id}>Thème</Label>
            <SwitchWrapper permanent={true}>
                <Switch
                    id={id}
                    size="lg"
                    checked={resolvedTheme === "dark"}
                    onCheckedChange={handleThemeChange}
                />
                <SwitchIndicator state="on">
                    <Sun className="text-muted-foreground size-4" />
                </SwitchIndicator>
                <SwitchIndicator state="off">
                    <Moon className="text-muted-foreground size-4" />
                </SwitchIndicator>
            </SwitchWrapper>
        </div>
    );
}
