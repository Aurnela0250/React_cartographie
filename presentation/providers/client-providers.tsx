"use client";

import { ReactNode, useEffect } from "react";
import { toast, Toaster } from "sonner";

// import { Toaster } from "@/presentation/components/ui/toaster";
import QueryProvider from "@/presentation/providers/query-provider";
import { ThemeProvider } from "@/presentation/providers/theme-provider";
import { ReactPlugin } from "@21st-extension/react";
import { TwentyFirstToolbar } from "@21st-extension/toolbar-next";

interface ClientProvidersProps {
    children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);

            if (params.get("toast") === "session-expired") {
                localStorage.setItem("session-expired-toast", "1");
                params.delete("toast");
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname +
                        (params.toString() ? "?" + params.toString() : "")
                );
            }
            if (localStorage.getItem("session-expired-toast") === "1") {
                toast.error(
                    "Votre session a expiré. Veuillez vous reconnecter."
                );
                localStorage.removeItem("session-expired-toast");
            }
        }
    }, []);

    return (
        <>
            <TwentyFirstToolbar config={{ plugins: [ReactPlugin] }} />
            <QueryProvider>
                <ThemeProvider
                    disableTransitionOnChange
                    enableSystem
                    attribute="class"
                    defaultTheme="light"
                >
                    {children}
                    <Toaster richColors />
                    {/* <ChatAI /> */}
                </ThemeProvider>
            </QueryProvider>
        </>
    );
}
