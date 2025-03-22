"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/shared/utils"
import { useUser } from "@/presentation/contexts/user-context"
import { BarChart3, Building, Settings, Users, BookOpen, LayoutDashboard, FileText, Shield } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()

  // Only show sidebar on dashboard pages
  if (!pathname.startsWith("/dashboard")) {
    return null
  }

  const isAdmin = user?.role === "admin" || user?.role === "superadmin"
  const isSuperAdmin = user?.role === "superadmin"

  const navItems = [
    {
      title: "Vue d'ensemble",
      href: "/dashboard",
      icon: LayoutDashboard,
      adminOnly: false,
    },
    {
      title: "Établissements",
      href: "/dashboard/establishments",
      icon: Building,
      adminOnly: false,
    },
    {
      title: "Formations",
      href: "/dashboard/programs",
      icon: BookOpen,
      adminOnly: false,
    },
    {
      title: "Statistiques",
      href: "/dashboard/statistics",
      icon: BarChart3,
      adminOnly: false,
    },
    {
      title: "Utilisateurs",
      href: "/dashboard/users",
      icon: Users,
      adminOnly: true,
    },
    {
      title: "Rapports",
      href: "/dashboard/reports",
      icon: FileText,
      adminOnly: true,
    },
    {
      title: "Paramètres",
      href: "/dashboard/settings",
      icon: Settings,
      adminOnly: false,
    },
    {
      title: "Permissions",
      href: "/dashboard/permissions",
      icon: Shield,
      superAdminOnly: true,
    },
  ]

  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">PS</span>
          </div>
          <span className="font-bold">Parcours Sup</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {navItems.map((item) => {
            // Skip items that require admin privileges if user is not admin
            if (item.adminOnly && !isAdmin) return null
            // Skip items that require superadmin privileges if user is not superadmin
            if (item.superAdminOnly && !isSuperAdmin) return null

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-foreground",
                  pathname === item.href ? "bg-muted text-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
          <div className="flex flex-col flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "Utilisateur"}</p>
            <p className="text-xs text-muted-foreground">{user?.role || "Rôle"}</p>
          </div>
          <Link href="/profile">
            <Settings className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  )
}

