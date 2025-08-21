import { Globe, Mail, MapPin, Phone } from "lucide-react";

import { Card, CardContent } from "@/presentation/components/ui/card";
import type { Establishment } from "@/src/entities/models/establishment.entity";

interface EstablishmentContactProps {
    establishment: Establishment;
}

export function EstablishmentContact({
    establishment,
}: EstablishmentContactProps) {
    return (
        <Card className="bg-card border-border rounded-2xl border">
            <CardContent className="space-y-4 p-6">
                <h3 className="text-foreground mb-6 text-xl font-semibold">
                    Contacts
                </h3>
                {/* Address */}
                <div className="flex items-start space-x-3">
                    <MapPin className="text-primary mt-0.5 h-5 w-5" />
                    <div>
                        <p className="text-muted-foreground text-sm">Adresse</p>
                        <p className="text-foreground">
                            {establishment.address ||
                                "BP 566, Antananarivo 101"}
                        </p>
                    </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3">
                    <Phone className="text-primary mt-0.5 h-5 w-5" />
                    <div>
                        <p className="text-muted-foreground text-sm">
                            Téléphone
                        </p>
                        {establishment.contacts &&
                        establishment.contacts.length > 0 ? (
                            <div className="space-y-1">
                                {establishment.contacts.map(
                                    (contact, index) => (
                                        <a
                                            key={index}
                                            href={`tel:${contact}`}
                                            className="text-foreground hover:text-primary block transition-colors"
                                        >
                                            {contact}
                                        </a>
                                    )
                                )}
                            </div>
                        ) : (
                            <span className="text-foreground">-</span>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3">
                    <Mail className="text-primary mt-0.5 h-5 w-5" />
                    <div>
                        <p className="text-muted-foreground text-sm">Email</p>
                        {establishment.emails &&
                        establishment.emails.length > 0 ? (
                            <div className="space-y-1">
                                {establishment.emails.map((email, index) => (
                                    <a
                                        key={index}
                                        href={`mailto:${email}`}
                                        className="text-foreground hover:text-primary block transition-colors"
                                    >
                                        {email}
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <span className="text-foreground">-</span>
                        )}
                    </div>
                </div>

                {/* Website */}
                <div className="flex items-center space-x-3">
                    <Globe className="text-primary h-5 w-5" />
                    <div>
                        <p className="text-muted-foreground text-sm">
                            Site web
                        </p>
                        {establishment.website ? (
                            <a
                                href={establishment.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground hover:text-primary transition-colors"
                            >
                                {establishment.website.replace(
                                    /^https?:\/\//,
                                    ""
                                )}
                            </a>
                        ) : (
                            <span className="text-foreground">-</span>
                        )}
                    </div>
                </div>

                {/* Interactive Map */}
                <div className="bg-muted mt-6 flex h-48 items-center justify-center rounded-lg">
                    <div className="text-center">
                        <MapPin className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                        <p className="text-muted-foreground text-sm">
                            Carte interactive
                        </p>
                        <p className="text-muted-foreground text-xs">
                            Localisation de l'établissement
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
