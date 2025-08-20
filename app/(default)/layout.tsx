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
            <main className="pt-20">{children}</main>
        </>
    );
}
