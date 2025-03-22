import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/presentation/components/ui/toaster"
import { ThemeProvider } from "@/presentation/components/features/theme-provider"
import { UserProvider } from "@/presentation/contexts/user-context"
import Navbar from "@/presentation/components/features/navbar"
import Sidebar from "@/presentation/components/features/sidebar"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "OrientaMada - Plateforme d'Orientation",
  description: "Trouvez votre établissement d'enseignement supérieur idéal",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <UserProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
              </div>
            </div>
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'