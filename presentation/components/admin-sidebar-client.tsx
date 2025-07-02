"use client";

import * as React from "react";

import { Sidebar } from "@/presentation/components/ui/sidebar";

interface AdminSidebarClientProps {
    children: React.ReactNode;
}

export function AdminSidebarClient({
    children,
    ...props
}: AdminSidebarClientProps & React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar variant="inset" {...props}>
            {children}
        </Sidebar>
    );
}
