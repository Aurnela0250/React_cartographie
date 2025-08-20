import Link from "next/link";
import { ArrowLeft, Building2, Calendar, Star, Users } from "lucide-react";

import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import type { Establishment } from "@/src/entities/models/establishment.entity";

interface EstablishmentHeaderCardProps {
    establishment: Establishment;
}

export function EstablishmentHeaderCard({
    establishment,
}: EstablishmentHeaderCardProps) {
    return (
        <div className="space-y-4">
            {/* Back button */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/establishments">
                        <ArrowLeft className="mr-2 size-4" />
                        Retour
                    </Link>
                </Button>
            </div>

            {/* Main card with header and stats */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Header section */}
                        <div className="mb-4 flex items-center space-x-3">
                            <div className="bg-primary/10 rounded-xl p-3">
                                <Building2 className="text-primary h-8 w-8" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-foreground mb-1 text-3xl font-bold">
                                    {establishment.name}
                                </h1>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        // variant="secondary"
                                        className="text-sm"
                                    >
                                        {establishment.acronym || "UA"}
                                    </Badge>
                                    <span className="text-muted-foreground">
                                        {(establishment as any)
                                            .establishmentType?.name ||
                                            "Université Publique"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed">
                            {establishment.description ||
                                "Description non disponible"}
                        </p>

                        {/* Stats section */}
                        <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-3">
                            <div className="flex items-center space-x-3">
                                <Calendar className="text-primary h-5 w-5" />
                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Fondé en
                                    </p>
                                    <p className="text-foreground font-semibold">
                                        1961
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Users className="text-primary h-5 w-5" />
                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Étudiants
                                    </p>
                                    <p className="text-foreground font-semibold">
                                        40,000+
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Star className="text-primary h-5 w-5" />
                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Note
                                    </p>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-foreground font-semibold">
                                            4.2
                                        </span>
                                        <div className="flex">
                                            {[1, 2, 3, 4].map((star) => (
                                                <Star
                                                    key={star}
                                                    className="h-4 w-4 fill-current text-yellow-400"
                                                />
                                            ))}
                                            <Star className="text-muted-foreground h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
