import Link from "next/link";
import {
    ArrowRight,
    Building2,
    Globe,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/presentation/components/ui/card";
import type { Establishment } from "@/src/entities/models/establishment.entity";

interface EstablishmentCardProps {
    establishment: Establishment;
}

export function EstablishmentCard({ establishment }: EstablishmentCardProps) {
    return (
        <Link
            href={`/establishments/${establishment.id}`}
            className="block h-full"
        >
            <Card className="flex h-full cursor-pointer flex-col transition-shadow hover:shadow-lg">
                {/* Header - Fixed height */}
                <CardHeader className="h-24 flex-shrink-0 pb-3">
                    <div className="flex h-full items-start justify-between">
                        <Building2 className="text-primary h-8 w-8 flex-shrink-0" />
                        <div className="flex flex-col items-end gap-1">
                            <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs">
                                {establishment.acronym || "-"}
                            </span>
                            {establishment.formations &&
                                establishment.formations.length > 0 && (
                                    <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">
                                        {establishment.formations.length}{" "}
                                        formation
                                        {establishment.formations.length > 1
                                            ? "s"
                                            : ""}
                                    </span>
                                )}
                        </div>
                    </div>
                </CardHeader>

                {/* Content - Flexible height */}
                <CardContent className="flex flex-1 flex-col">
                    {/* Title - Fixed height */}
                    <h4 className="text-foreground mb-2 line-clamp-2 min-h-[3.5rem] text-lg font-semibold">
                        {establishment.name || "Nom non disponible"}
                    </h4>

                    {/* Location - Fixed height */}
                    <div className="text-muted-foreground mb-2 flex min-h-[1.5rem] items-center">
                        <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1 text-sm">
                            {establishment.address || "-"}
                        </span>
                    </div>

                    {/* Description - Flexible height */}
                    <p className="text-muted-foreground mb-4 line-clamp-3 flex-1 text-sm">
                        {establishment.description ||
                            "Description non disponible"}
                    </p>

                    {/* Formations - Show first 3 */}
                    {establishment.formations &&
                        establishment.formations.length > 0 && (
                            <div className="mb-4 flex flex-wrap gap-2">
                                {establishment.formations
                                    .slice(0, 3)
                                    .map((formation: any, index: number) => (
                                        <span
                                            key={formation.id || index}
                                            className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2 py-1 text-xs"
                                        >
                                            <GraduationCap className="mr-1 h-3 w-3" />
                                            {formation.domain ||
                                                formation.name ||
                                                `Formation ${index + 1}`}
                                        </span>
                                    ))}
                                {establishment.formations.length > 3 && (
                                    <span className="text-muted-foreground text-xs">
                                        +{establishment.formations.length - 3}{" "}
                                        autres
                                    </span>
                                )}
                            </div>
                        )}
                </CardContent>

                {/* Footer - Fixed height */}
                <CardFooter className="border-border h-12 flex-shrink-0 items-center justify-between border-t pt-4">
                    <div className="text-muted-foreground flex space-x-3">
                        {establishment.contacts &&
                            establishment.contacts.length > 0 && (
                                <Phone className="h-4 w-4" />
                            )}
                        {establishment.emails &&
                            establishment.emails.length > 0 && (
                                <Mail className="h-4 w-4" />
                            )}
                        {establishment.website && <Globe className="h-4 w-4" />}
                    </div>
                    <span className="text-primary flex items-center gap-1 text-sm font-medium hover:underline">
                        Voir détails
                        <ArrowRight className="h-3 w-3" />
                    </span>
                </CardFooter>
            </Card>
        </Link>
    );
}
