"use client";

import { useState } from "react";
import { ArrowUpDown, MoreHorizontal, Search } from "lucide-react";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/presentation/components/ui/avatar";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { Input } from "@/presentation/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/presentation/components/ui/table";

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
];

const roleLabels: Record<string, string> = {
    superadmin: "Super Admin",
    admin: "Admin",
    admin_establishment: "Admin Établissement",
    visitor: "Visiteur",
};

export function UserTable() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const filteredUsers = mockUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            roleLabels[user.role]
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortField) return 0;

        const fieldA = a[sortField as keyof typeof a];
        const fieldB = b[sortField as keyof typeof b];

        if (typeof fieldA === "string" && typeof fieldB === "string") {
            return sortDirection === "asc"
                ? fieldA.localeCompare(fieldB)
                : fieldB.localeCompare(fieldA);
        }

        return 0;
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute left-2.5 top-2.5 size-4" />
                    <Input
                        className="pl-8"
                        placeholder="Rechercher un utilisateur..."
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
                                <Button
                                    className="p-0 font-medium"
                                    variant="ghost"
                                    onClick={() => handleSort("name")}
                                >
                                    Utilisateur
                                    <ArrowUpDown className="ml-2 size-4" />
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    className="p-0 font-medium"
                                    variant="ghost"
                                    onClick={() => handleSort("email")}
                                >
                                    Email
                                    <ArrowUpDown className="ml-2 size-4" />
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    className="p-0 font-medium"
                                    variant="ghost"
                                    onClick={() => handleSort("role")}
                                >
                                    Rôle
                                    <ArrowUpDown className="ml-2 size-4" />
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    className="p-0 font-medium"
                                    variant="ghost"
                                    onClick={() => handleSort("status")}
                                >
                                    Statut
                                    <ArrowUpDown className="ml-2 size-4" />
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    className="p-0 font-medium"
                                    variant="ghost"
                                    onClick={() => handleSort("lastActive")}
                                >
                                    Dernière activité
                                    <ArrowUpDown className="ml-2 size-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="w-[50px]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedUsers.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    className="text-muted-foreground py-8 text-center"
                                    colSpan={6}
                                >
                                    Aucun utilisateur trouvé
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-8">
                                                <AvatarImage
                                                    alt={user.name}
                                                    src={user.avatar}
                                                />
                                                <AvatarFallback>
                                                    {user.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="font-medium">
                                                {user.name}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {roleLabels[user.role]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.status === "active"
                                                    ? "default"
                                                    : user.status === "inactive"
                                                      ? "secondary"
                                                      : "outline"
                                            }
                                        >
                                            {user.status === "active"
                                                ? "Actif"
                                                : user.status === "inactive"
                                                  ? "Inactif"
                                                  : "En attente"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {user.lastActive}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    <MoreHorizontal className="size-4" />
                                                    <span className="sr-only">
                                                        Menu
                                                    </span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                    Actions
                                                </DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    Voir le profil
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    Modifier
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    Changer le rôle
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">
                                                    Désactiver le compte
                                                </DropdownMenuItem>
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
    );
}
