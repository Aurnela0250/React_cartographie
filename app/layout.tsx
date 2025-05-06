import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { Toaster } from "@/presentation/components/ui/toaster";
import { UserProvider } from "@/presentation/contexts/user-context";
import QueryProvider from "@/presentation/providers/query-provider";
import { ThemeProvider } from "@/presentation/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
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
                <QueryProvider>
                    <ThemeProvider
                        disableTransitionOnChange
                        enableSystem
                        attribute="class"
                        defaultTheme="light"
                    >
                        <UserProvider>
                            {children}
                            <Toaster />
                        </UserProvider>
                    </ThemeProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
