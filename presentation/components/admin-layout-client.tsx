"use client";

import * as React from "react";

import { SidebarProvider } from "@/presentation/components/ui/sidebar";

interface AdminLayoutClientProps {
    children: React.ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
    return <SidebarProvider>{children}</SidebarProvider>;
}
