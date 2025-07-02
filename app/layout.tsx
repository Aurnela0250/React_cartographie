import { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import ClientProviders from "@/presentation/providers/client-providers";

import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "OrientaMada - Plateforme d'Orientation",
    description: "Trouvez votre établissement d'enseignement supérieur idéal",
    generator: "v0.dev",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html suppressHydrationWarning lang="fr">
            <body className={inter.className}>
                <ClientProviders>
                    <NuqsAdapter>{children}</NuqsAdapter>
                </ClientProviders>
            </body>
        </html>
    );
}
