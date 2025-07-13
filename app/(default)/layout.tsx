import React from "react";

import Navbar from "@/presentation/components/features/navbar";

export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">{children}</main>
        </>
    );
}
