import React from "react";

import Navbar from "@/presentation/components/features/navbar";
import Sidebar from "@/presentation/components/features/sidebar";

export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
