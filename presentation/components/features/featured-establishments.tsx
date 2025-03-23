import Link from "next/link";
import { MapPin, Star, Users } from "lucide-react";

import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";

const featuredEstablishments = [
    {
        id: "1",
        name: "Université d'Antananarivo",
        type: "Université",
        address: "Ankatso, Antananarivo",
        students: 48000,
        rating: 4.2,
        image: "/placeholder.svg?height=200&width=300",
    },
    {
        id: "2",
        name: "École Polytechnique",
        type: "Grande École",
        address: "Vontovorona, Anatananarivo",
        students: 3000,
        rating: 4.8,
        image: "/placeholder.svg?height=200&width=300",
    },
    {
        id: "3",
        name: "ESMIA ",
        type: "Université",
        address: "Mahamasina, Antananarivo",
        students: 55000,
        rating: 4.5,
        image: "/placeholder.svg?height=200&width=300",
    },
];

export function FeaturedEstablishments() {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Établissements à la une</h2>
                <Button asChild variant="ghost">
                    <Link href="/establishments">Voir tous</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredEstablishments.map((establishment) => (
                    <Card key={establishment.id} className="overflow-hidden">
                        <div
                            className="h-40 w-full bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${establishment.image})`,
                            }}
                        />
                        <CardContent className="p-4">
                            <div className="mb-2 flex items-start justify-between">
                                <Badge variant="outline">
                                    {establishment.type}
                                </Badge>
                                <div className="flex items-center gap-1">
                                    <Star className="size-4 fill-yellow-500 text-yellow-500" />
                                    <span className="text-sm font-medium">
                                        {establishment.rating}
                                    </span>
                                </div>
                            </div>

                            <h3 className="mb-1 text-lg font-semibold">
                                {establishment.name}
                            </h3>

                            <div className="text-muted-foreground mb-2 flex items-center">
                                <MapPin className="mr-1 size-3" />
                                <span className="text-sm">
                                    {establishment.address}
                                </span>
                            </div>

                            <div className="text-muted-foreground mb-4 flex items-center">
                                <Users className="mr-1 size-3" />
                                <span className="text-sm">
                                    {establishment.students.toLocaleString()}{" "}
                                    étudiants
                                </span>
                            </div>

                            <Button asChild className="w-full">
                                <Link
                                    href={`/establishments/${establishment.id}`}
                                >
                                    Découvrir
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
