"use client";

import * as React from "react";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/presentation/components/ui/sidebar";

// Importer les icônes si nécessaire, ou les omettre pour un menu plus simple
// import { type LucideIcon } from "lucide-react"

// Assurez-vous que ce chemin est correct

export interface AdminNavItem {
    title: string;
    url: string;
    // icon?: LucideIcon; // Décommentez si vous souhaitez ajouter des icônes plus tard
    isActive?: boolean;
}

export function AdminNavMain({ items }: { items: AdminNavItem[] }) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Gestion</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                            <a href={item.url}>
                                {/* {item.icon && <item.icon className="size-4" />} */}
                                <span>{item.title}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
