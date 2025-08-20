import React from "react";

import {
    SidebarInset,
    SidebarProvider,
} from "@/presentation/components/ui/sidebar";

import { EstablishmentsFilterSidebar } from "../_components/establishments-filter-sidebar";

export default function EstablishmentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider
            style={
                {
                    // keep same CSS vars as the previous page
                    // ensures consistent sizing with the trigger and inset
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            {/* Static Sidebar with filters (Server Component with nested client parts) */}
            <EstablishmentsFilterSidebar
                className="top-20 z-40 h-[calc(100vh-5rem)]"
                variant="floating"
            />

            {/* Only children below will re-render on searchParams change */}
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
    );
}
