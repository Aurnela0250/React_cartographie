import * as React from "react";
import {
    BookOpen,
    Building,
    Building2,
    CircleGauge,
    Command,
    MapPinned,
    Settings2,
    University,
} from "lucide-react";

import {
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/presentation/components/ui/sidebar";

import { AdminSidebarClient } from "./admin-sidebar-client";
import { LogoutButton } from "./logout-button";
import { NavMainServer } from "./nav-main-server";

const data = {
    navMain: [
        {
            title: "Régions",
            url: "/admin/regions",
            icon: MapPinned,
            isActive: true,
            items: [],
        },
        {
            title: "Niveaux",
            url: "/admin/levels",
            icon: CircleGauge,
            items: [],
        },
        {
            title: "Domaines",
            url: "/admin/domains",
            icon: BookOpen,
            items: [],
        },
        {
            title: "Mentions",
            url: "/admin/mentions",
            icon: Settings2,
            items: [],
        },
        {
            title: "Types d'établissement",
            url: "/admin/establishment-types",
            icon: University,
            items: [],
        },
        {
            title: "Villes",
            url: "/admin/cities",
            icon: Building2,
            items: [],
        },
        {
            title: "Etablissements",
            url: "/admin/establishments",
            icon: Building,
            items: [],
        },
    ],
};

// Version Server Component de la sidebar
export function AdminSidebarServer() {
    return (
        <AdminSidebarClient>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="lg">
                            <a href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        Orienta Mada
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMainServer items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                {/* Bouton de déconnexion reste client car interactif */}
                <LogoutButton />
            </SidebarFooter>
        </AdminSidebarClient>
    );
}
