import { Inter } from "next/font/google";

import { Toaster } from "@/presentation/components/ui/toaster";
import QueryProvider from "@/presentation/providers/query-provider";
import { AuthProvider } from "@/presentation/providers/session-provider";
import { ThemeProvider } from "@/presentation/providers/theme-provider";

import "@/styles/globals.css";

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
                <AuthProvider>
                    <QueryProvider>
                        <ThemeProvider
                            disableTransitionOnChange
                            enableSystem
                            attribute="class"
                            defaultTheme="light"
                        >
                            {children}
                            <Toaster />
                            {/* <ChatAI /> */}
                        </ThemeProvider>
                    </QueryProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
