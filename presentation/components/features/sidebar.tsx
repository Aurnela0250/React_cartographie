"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    BookOpen,
    Building,
    FileText,
    LayoutDashboard,
    Settings,
    Shield,
    Users,
} from "lucide-react";

import { cn } from "@/shared/utils";

export default function Sidebar() {
    const pathname = usePathname();

    // Only show sidebar on dashboard pages
    if (!pathname.startsWith("/dashboard")) {
        return null;
    }

    // const isAdmin = user?.role === "admin" || user?.role === "superadmin";
    // const isSuperAdmin = user?.role === "superadmin";

    const navItems = [
        {
            title: "Vue d'ensemble",
            href: "/dashboard",
            icon: LayoutDashboard,
            adminOnly: false,
        },
        {
            title: "Établissements",
            href: "/dashboard/establishments",
            icon: Building,
            adminOnly: false,
        },
        {
            title: "Formations",
            href: "/dashboard/programs",
            icon: BookOpen,
            adminOnly: false,
        },
        {
            title: "Statistiques",
            href: "/dashboard/statistics",
            icon: BarChart3,
            adminOnly: false,
        },
        {
            title: "Utilisateurs",
            href: "/dashboard/users",
            icon: Users,
            adminOnly: true,
        },
        {
            title: "Rapports",
            href: "/dashboard/reports",
            icon: FileText,
            adminOnly: true,
        },
        {
            title: "Paramètres",
            href: "/dashboard/settings",
            icon: Settings,
            adminOnly: false,
        },
        {
            title: "Permissions",
            href: "/dashboard/permissions",
            icon: Shield,
            superAdminOnly: true,
        },
    ];

    return (
        <div className="hidden h-screen w-64 flex-col border-r bg-background md:flex">
            <div className="flex h-14 items-center border-b px-4">
                <Link className="flex items-center gap-2" href="/">
                    <div className="flex size-6 items-center justify-center rounded-full bg-primary">
                        <span className="text-xs font-bold text-primary-foreground">
                            PS
                        </span>
                    </div>
                    <span className="font-bold">Parcours Sup</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-2 text-sm">
                    {navItems.map((item) => {
                        // Skip items that require admin privileges if user is not admin
                        // if (item.adminOnly && !isAdmin) return null;
                        // Skip items that require superadmin privileges if user is not superadmin
                        // if (item.superAdminOnly && !isSuperAdmin) return null;

                        return (
                            <Link
                                key={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-foreground",
                                    pathname === item.href
                                        ? "bg-muted text-foreground"
                                        : "text-muted-foreground"
                                )}
                                href={item.href}
                            >
                                <item.icon className="size-4" />
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="mt-auto border-t p-4">
                <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
                    <div className="flex flex-1 flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user?.name || "Utilisateur"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {user?.role || "Rôle"}
                        </p>
                    </div>
                    <Link href="/profile">
                        <Settings className="size-4 text-muted-foreground transition-colors hover:text-foreground" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
