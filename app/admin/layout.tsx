import * as React from "react";

import { AdminLayoutClient } from "@/presentation/components/admin-layout-client";
import { AdminSidebarServer } from "@/presentation/components/admin-sidebar-server";
import { DynamicBreadcrumb } from "@/presentation/components/dynamic-breadcrumb";
import { Separator } from "@/presentation/components/ui/separator";
import {
    SidebarInset,
    SidebarTrigger,
} from "@/presentation/components/ui/sidebar";

// Assurez-vous que ce chemin est correct

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminLayoutClient>
            <AdminSidebarServer />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            className="mr-2 h-4"
                            orientation="vertical"
                        />
                        <DynamicBreadcrumb />
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
            </SidebarInset>
        </AdminLayoutClient>
    );
}
