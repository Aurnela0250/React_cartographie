import { Building, MapPin, Users, Star } from "lucide-react";

import { Badge } from "@/presentation/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";

interface EstablishmentCardProps {
    establishment: any;
}

export function EstablishmentCard({ establishment }: EstablishmentCardProps) {
    return (
        <Card className="h-full hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                            {establishment.name || "Nom non disponible"}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="size-4" />
                            <span>{establishment.city?.name || "Ville non spécifiée"}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                        <Star className="size-4 fill-yellow-400 text-yellow-400" />
                        <span>4.5</span>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {establishment.description || "Description non disponible"}
                    </p>
                    
                    {/* Domains */}
                    <div className="flex flex-wrap gap-1">
                        {establishment.domains?.slice(0, 3).map((domain: any, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                                {domain.name}
                            </Badge>
                        )) || (
                            <Badge variant="secondary" className="text-xs">
                                Domaine non spécifié
                            </Badge>
                        )}
                        {establishment.domains?.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{establishment.domains.length - 3}
                            </Badge>
                        )}
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Users className="size-4" />
                            <span>{establishment.studentsCount || "N/A"} étudiants</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Building className="size-4" />
                            <span>{establishment.type || "Public"}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
