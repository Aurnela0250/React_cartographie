"use client";

import * as React from "react";
import { SidebarIcon } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import { Separator } from "@/presentation/components/ui/separator";
import { useSidebar } from "@/presentation/components/ui/sidebar";

export function SiteHeader() {
    const { toggleSidebar } = useSidebar?.() || { toggleSidebar: () => {} };

    return (
        <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
            <div className="flex h-[--header-height] w-full items-center gap-2 px-4">
                <Button
                    className="size-8"
                    size="icon"
                    variant="ghost"
                    onClick={toggleSidebar}
                >
                    <SidebarIcon />
                </Button>
                <Separator className="mr-2 h-4" orientation="vertical" />
                <span className="text-lg font-semibold">Administration</span>
                {/* Ajoutez ici d'autres éléments d'en-tête si besoin */}
            </div>
        </header>
    );
}
