"use client";

import { ArrowUpDown, MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

const mockEstablishments = [
  {
    id: "1",
    name: "Université d'Antananarivo",
    type: "Université",
    region: "Analamanga",
    city: "Antananarivo",
    programs: 350,
    status: "active",
  },
  {
    id: "2",
    name: "École Polytechnique",
    type: "Grande École",
    region: "Analamanga",
    city: "Antananarivo",
    programs: 120,
    status: "active",
  },
  {
    id: "3",
    name: "ESMIA",
    type: "Université",
    region: "Analamanaga",
    city: "Antananarivo",
    programs: 400,
    status: "active",
  },
  {
    id: "4",
    name: "IEP",
    type: "Institut",
    region: "Analamanga",
    city: "Antananarivo",
    programs: 80,
    status: "active",
  },
  {
    id: "5",
    name: "INSCAE",
    type: "Institut",
    region: "Analamanga",
    city: "Antananarivo",
    programs: 90,
    status: "active",
  },
  {
    id: "6",
    name: "UCM",
    type: "Université",
    region: "Analamanga",
    city: "Antananarivo",
    programs: 280,
    status: "pending",
  },
  {
    id: "7",
    name: "EMedia",
    type: "Université",
    region: "Analamanga",
    city: "Antananarivo",
    programs: 75,
    status: "active",
  },
];

export function EstablishmentTable() {
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

  const filteredEstablishments = mockEstablishments.filter(
    (establishment) =>
      establishment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      establishment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      establishment.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      establishment.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEstablishments = [...filteredEstablishments].sort((a, b) => {
    if (!sortField) return 0;

    const fieldA = a[sortField as keyof typeof a];
    const fieldB = b[sortField as keyof typeof b];

    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortDirection === "asc"
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }

    if (typeof fieldA === "number" && typeof fieldB === "number") {
      return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA;
    }

    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un établissement..."
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
              <TableHead className="w-[300px]">
                <Button
                  variant="ghost"
                  className="p-0 font-medium"
                  onClick={() => handleSort("name")}
                >
                  Nom
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 font-medium"
                  onClick={() => handleSort("type")}
                >
                  Type
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 font-medium"
                  onClick={() => handleSort("region")}
                >
                  Région
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 font-medium"
                  onClick={() => handleSort("city")}
                >
                  Ville
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 font-medium"
                  onClick={() => handleSort("programs")}
                >
                  Formations
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 font-medium"
                  onClick={() => handleSort("status")}
                >
                  Statut
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEstablishments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  Aucun établissement trouvé
                </TableCell>
              </TableRow>
            ) : (
              sortedEstablishments.map((establishment) => (
                <TableRow key={establishment.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/establishments/${establishment.id}`}
                      className="hover:underline"
                    >
                      {establishment.name}
                    </Link>
                  </TableCell>
                  <TableCell>{establishment.type}</TableCell>
                  <TableCell>{establishment.region}</TableCell>
                  <TableCell>{establishment.city}</TableCell>
                  <TableCell>{establishment.programs}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        establishment.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {establishment.status === "active"
                        ? "Actif"
                        : "En attente"}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Supprimer
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
