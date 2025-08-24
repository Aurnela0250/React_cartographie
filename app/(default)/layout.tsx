import React from "react";

import { NavBar } from "../_components/header";

export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <NavBar />
            <main className="overflow-hidden">{children}</main>
        </>
    );
}
