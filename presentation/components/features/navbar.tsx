"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/presentation/components/ui/button"
import { Input } from "@/presentation/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/presentation/components/ui/avatar"
import { ModeToggle } from "@/presentation/components/features/mode-toggle"
import { useUser } from "@/presentation/contexts/user-context"
import { Bell, Menu, Search, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/presentation/components/ui/sheet"

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useUser()
  const [showSearch, setShowSearch] = useState(false)

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <div className="md:hidden mr-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className={`px-2 py-1 rounded-md ${pathname === "/" ? "bg-muted font-medium" : ""}`}>
                  Accueil
                </Link>
                <Link
                  href="/map"
                  className={`px-2 py-1 rounded-md ${pathname === "/map" ? "bg-muted font-medium" : ""}`}
                >
                  Carte
                </Link>
                <Link
                  href="/establishments"
                  className={`px-2 py-1 rounded-md ${pathname === "/establishments" ? "bg-muted font-medium" : ""}`}
                >
                  Établissements
                </Link>
                <Link
                  href="/chatbot"
                  className={`px-2 py-1 rounded-md ${pathname === "/chatbot" ? "bg-muted font-medium" : ""}`}
                >
                  Assistant IA
                </Link>
                {user?.role !== "visitor" && (
                  <Link
                    href="/dashboard"
                    className={`px-2 py-1 rounded-md ${pathname === "/dashboard" ? "bg-muted font-medium" : ""}`}
                  >
                    Tableau de bord
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-2 mr-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">PS</span>
            </div>
            <span className="font-bold hidden md:inline-block">Parcours Sup</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 mx-6">
          <Link
            href="/"
            className={`text-sm font-medium ${
              pathname === "/" ? "text-foreground" : "text-muted-foreground"
            } transition-colors hover:text-foreground`}
          >
            Accueil
          </Link>
          <Link
            href="/map"
            className={`text-sm font-medium ${
              pathname === "/map" ? "text-foreground" : "text-muted-foreground"
            } transition-colors hover:text-foreground`}
          >
            Carte
          </Link>
          <Link
            href="/establishments"
            className={`text-sm font-medium ${
              pathname === "/establishments" ? "text-foreground" : "text-muted-foreground"
            } transition-colors hover:text-foreground`}
          >
            Établissements
          </Link>
          <Link
            href="/chatbot"
            className={`text-sm font-medium ${
              pathname === "/chatbot" ? "text-foreground" : "text-muted-foreground"
            } transition-colors hover:text-foreground`}
          >
            Assistant IA
          </Link>
          {user?.role !== "visitor" && (
            <Link
              href="/dashboard"
              className={`text-sm font-medium ${
                pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              Tableau de bord
            </Link>
          )}
        </nav>

        <div className="flex items-center ml-auto gap-2">
          {showSearch ? (
            <div className="relative">
              <Input placeholder="Rechercher..." className="w-[200px] md:w-[300px]" autoFocus />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => setShowSearch(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Rechercher</span>
            </Button>
          )}

          <ModeToggle />

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Mon profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/favorites">Mes favoris</Link>
                </DropdownMenuItem>
                {user.role !== "visitor" && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Tableau de bord</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Se déconnecter</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Connexion</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Inscription</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

