import { forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, MapPin, Star } from "lucide-react";

import { Establishment } from "@/core/entities/establishment.entity";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";

interface CardEstablishmentProps {
    establishment: Establishment;
}

export const EstablishmentCard = forwardRef<
    HTMLDivElement,
    CardEstablishmentProps
>(({ establishment }, ref) => {
    return (
        <Card
            key={establishment.id}
            ref={ref}
            className="overflow-hidden transition-shadow hover:shadow-md"
        >
            <div className="relative h-40 w-full">
                <Image
                    fill
                    alt={"Établissement"}
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={establishment.siteUrl || "/university-icon.svg"}
                />
            </div>
            <CardContent className="p-4">
                <div className="grow">
                    <div className="mb-2 flex items-start justify-between">
                        <Badge variant="outline">
                            {establishment.establishmentType?.name ||
                                "Établissement"}
                        </Badge>
                        <div className="flex items-center gap-1">
                            <Star className="size-4 fill-yellow-500 text-yellow-500" />
                            <span className="text-sm font-medium">
                                {establishment.rating || "0.0"}
                            </span>
                        </div>
                    </div>

                    <h3 className="mb-1 line-clamp-2 text-lg font-semibold">
                        {establishment.name}
                        {establishment.acronyme && (
                            <span className="text-muted-foreground">
                                {" "}
                                ({establishment.acronyme})
                            </span>
                        )}
                    </h3>

                    <div className="mb-2 flex items-center text-muted-foreground">
                        <MapPin className="mr-1 size-3" />
                        <span className="line-clamp-1 text-sm">
                            {establishment.address || "Adresse non disponible"}
                        </span>
                    </div>

                    <div className="mb-4 flex items-center text-muted-foreground">
                        <BookOpen className="mr-1 size-3" />
                        <span className="text-sm">
                            {establishment.formations?.length || 0} formations
                        </span>
                    </div>
                </div>
                <div className="mt-4 flex gap-2">
                    <Button
                        asChild
                        className="flex-1"
                        size="sm"
                        variant="outline"
                    >
                        <Link href={`/map?id=${establishment.id}`}>Carte</Link>
                    </Button>
                    <Button asChild className="flex-1" size="sm">
                        <Link href={`/establishments/${establishment.id}`}>
                            Détails
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
});

EstablishmentCard.displayName = "EstablishmentCard";
