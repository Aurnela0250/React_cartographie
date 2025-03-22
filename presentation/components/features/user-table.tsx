"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/presentation/components/ui/table"
import { Button } from "@/presentation/components/ui/button"
import { Badge } from "@/presentation/components/ui/badge"
import { Input } from "@/presentation/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/presentation/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu"
import { MoreHorizontal, Search, ArrowUpDown } from "lucide-react"

// Mock data for users
const mockUsers = [
  {
    id: "1",
    name: "Sophie Randria",
    email: "sophie.randria@example.com",
    role: "admin",
    status: "active",
    lastActive: "Il y a 10 minutes",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "Thomas Rakoto",
    email: "thomas.rakoto@example.com",
    role: "admin_establishment",
    status: "active",
    lastActive: "Il y a 2 heures",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    name: "Emma IUM",
    email: "emma.ium@example.com",
    role: "superadmin",
    status: "active",
    lastActive: "Il y a 5 minutes",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    name: "Lucas Rabe",
    email: "lucas.rabe@example.com",
    role: "admin_establishment",
    status: "active",
    lastActive: "Il y a 1 jour",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "5",
    name: "Julie Rasoa",
    email: "julie.rasoa@example.com",
    role: "admin",
    status: "inactive",
    lastActive: "Il y a 5 jours",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "6",
    name: "Antoine Koto",
    email: "antoine.koto@example.com",
    role: "visitor",
    status: "active",
    lastActive: "Il y a 3 heures",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "7",
    name: "Camille Bao",
    email: "camille.bao@example.com",
    role: "admin_establishment",
    status: "pending",
    lastActive: "Jamais",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const roleLabels: Record<string, string> = {
  superadmin: "Super Admin",
  admin: "Admin",
  admin_establishment: "Admin Établissement",
  visitor: "Visiteur",
}

export function UserTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roleLabels[user.role].toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0

    const fieldA = a[sortField as keyof typeof a]
    const fieldB = b[sortField as keyof typeof b]

    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortDirection === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
    }

    return 0
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un utilisateur..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("name")}>
                  Utilisateur
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("email")}>
                  Email
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("role")}>
                  Rôle
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("status")}>
                  Statut
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("lastActive")}>
                  Dernière activité
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              sortedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{roleLabels[user.role]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : user.status === "inactive" ? "secondary" : "outline"
                      }
                    >
                      {user.status === "active" ? "Actif" : user.status === "inactive" ? "Inactif" : "En attente"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem>Changer le rôle</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Désactiver le compte</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

