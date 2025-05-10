import * as React from "react";

import { AdminEtabSidebar } from "@/presentation/components/admin-etab-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/presentation/components/ui/breadcrumb";
import { Separator } from "@/presentation/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/presentation/components/ui/sidebar";

// Assurez-vous que ce chemin est correct

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AdminEtabSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            className="mr-2 h-4"
                            orientation="vertical"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Building Your Application
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        Data Fetching
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
