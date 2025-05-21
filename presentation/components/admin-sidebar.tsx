"use client";

import * as React from "react";
import {
    BookOpen,
    Building,
    Building2,
    CircleGauge,
    Command,
    Factory,
    MapPinned,
    Settings2,
    University,
} from "lucide-react";

import { NavMain } from "@/presentation/components/nav-main";
import { NavUser } from "@/presentation/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/presentation/components/ui/sidebar";

import { useSession } from "../hooks/use-session";

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
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
            title: "Secteurs",
            url: "/admin/sectors",
            icon: Factory,
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

export function AdminSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const session = useSession();

    const { user } = session;

    return (
        <Sidebar variant="inset" {...props}>
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
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
