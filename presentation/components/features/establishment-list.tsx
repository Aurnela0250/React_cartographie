"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Building, MapPin, Star, Users } from "lucide-react";

import Etablissements from "@/presentation/components/features/ListeEtablissements";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";

const mockEstablishments = [
    {
        id: "1",
        name: "Université d'Antananarivo",
        type: "Université",
        address: "Ankatso, Antananarivo",
        region: "Analamanga",
        programs: 350,
        students: 48000,
        rating: 4.2,
        image: "/placeholder.svg?height=100&width=150",
    },
    {
        id: "2",
        name: "École Polytechnique",
        type: "Grande École",
        address: "Vontovorona, Anatananarivo",
        region: "Analamanga",
        programs: 120,
        students: 3000,
        rating: 4.8,
        image: "/placeholder.svg?height=100&width=150",
    },
    {
        id: "3",
        name: "ESMIA ",
        type: "Université",
        address: "Mahamasina, Antananarivo",
        region: "Analamanga",
        programs: 400,
        students: 55000,
        rating: 4.5,
        image: "/placeholder.svg?height=100&width=150",
    },
    {
        id: "4",
        name: "IEP",
        type: "Institut",
        address: "Ampasanimalo",
        region: "Analamanga",
        programs: 80,
        students: 14000,
        rating: 4.6,
        image: "/placeholder.svg?height=100&width=150",
    },
    {
        id: "5",
        name: "INSCAE",
        type: "Institue",
        address: "67Ha, Antananarivo",
        region: "Analamanga",
        programs: 90,
        students: 6000,
        rating: 4.3,
        image: "/placeholder.svg?height=100&width=150",
    },
];

export function EstablishmentList() {
    const [establishments] = useState(mockEstablishments);

    return (
        <div className="space-y-4">
            {establishments.map((establishment) => (
                <Card key={establishment.id} className="overflow-hidden">
                    <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                            <div className="h-40 w-full md:h-auto md:w-1/4">
                                <div
                                    className="size-full bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${establishment.image})`,
                                    }}
                                />
                            </div>
                            <div className="flex-1 p-4 md:p-6">
                                <div className="flex flex-col justify-between md:flex-row">
                                    <div>
                                        <div className="mb-1 flex items-center gap-2">
                                            <Badge variant="outline">
                                                {establishment.type}
                                            </Badge>
                                            <Badge variant="secondary">
                                                {establishment.region}
                                            </Badge>
                                        </div>
                                        <h3 className="mb-2 text-xl font-semibold">
                                            {establishment.name}
                                        </h3>
                                        <div className="mb-4 flex items-center text-muted-foreground">
                                            <MapPin className="mr-1 size-4" />
                                            <span className="text-sm">
                                                {establishment.address}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-start gap-1 md:mt-0">
                                        <Star className="size-5 fill-yellow-500 text-yellow-500" />
                                        <span className="font-medium">
                                            {establishment.rating}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="flex items-center">
                                        <Building className="text-muted-foreground mr-2 size-5" />
                                        <div>
                                            <p className="text-sm font-medium">
                                                Type
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {establishment.type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <BookOpen className="text-muted-foreground mr-2 size-5" />
                                        <div>
                                            <p className="text-sm font-medium">
                                                Formations
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {establishment.programs}{" "}
                                                programmes
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="text-muted-foreground mr-2 size-5" />
                                        <div>
                                            <p className="text-sm font-medium">
                                                Étudiants
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {establishment.students.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                                    <Button
                                        asChild
                                        className="sm:flex-1"
                                        variant="outline"
                                    >
                                        <Link
                                            href={`/map?id=${establishment.id}`}
                                        >
                                            Voir sur la carte
                                        </Link>
                                    </Button>
                                    <Button asChild className="sm:flex-1">
                                        <Link
                                            href={`/establishments/${establishment.id}`}
                                        >
                                            Détails de l'établissement
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Etablissements />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
