"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    Award,
    Building,
    Calendar,
    Globe,
    Mail,
    MapPin,
    Phone,
    Star,
    Users,
} from "lucide-react";

import { Establishment } from "@/core/entities/establishment.entity";
import { EstablishmentGallery } from "@/presentation/components/features/establishment-gallery";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/presentation/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function fetchEstablishmentById(id: string): Promise<Establishment> {
    if (!id) throw new Error("ID d'établissement non fourni");
    const res = await fetch(`${API_URL}/api/establishments/${id}`, {
        cache: "no-store",
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error(
            "Erreur lors de la récupération des détails de l'établissement"
        );
    }
    const data = await res.json();

    return Establishment.fromUnknown(data);
}

export default function EstablishmentPage() {
    const params = useParams() as Record<string, string | string[]> | null;
    const id =
        params && typeof params.id === "string"
            ? params.id
            : params && Array.isArray(params.id)
              ? params.id[0]
              : "";
    const {
        data: establishment,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["establishment", id],
        queryFn: () => fetchEstablishmentById(id),
        enabled: !!id,
    });

    // Images pour la galerie (placeholder pour l'instant)
    const images = [
        "/images/establishment-placeholder.jpg",
        "/images/establishment-placeholder.jpg",
        "/images/establishment-placeholder.jpg",
    ];

    // Facilités (à adapter selon les données réelles)
    const facilities = [
        "Bibliothèque",
        "Laboratoires",
        "Résidences",
        "Restaurants",
        "Installations sportives",
    ];

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    if (isError || !establishment) {
        return <div>Erreur lors de la récupération de l'établissement.</div>;
    }

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <Badge variant="outline">
                            {establishment.establishmentType?.name ||
                                "Établissement"}
                        </Badge>
                        <Link
                            className="text-sm text-muted-foreground hover:underline"
                            href="/map"
                        >
                            Retour à la carte
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold">
                        {establishment.name || "Établissement non trouvé"}
                        {establishment.acronyme &&
                            ` (${establishment.acronyme})`}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Ajouter aux favoris</Button>
                    <Button>Demander des informations</Button>
                </div>
            </div>

            {/* Grille principale */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Colonne principale */}
                <div className="space-y-6 lg:col-span-2">
                    <EstablishmentGallery images={images} />

                    <Card>
                        <CardContent className="p-6">
                            <h2 className="mb-4 text-2xl font-semibold">
                                À propos
                            </h2>
                            <p className="text-muted-foreground">
                                {establishment.description ||
                                    "Aucune description disponible pour cet établissement."}
                            </p>

                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                                {!!establishment.formations && (
                                    <div className="flex items-center gap-2">
                                        <Users className="size-5 text-muted-foreground" />
                                        <span>
                                            {establishment.formations.length ||
                                                0}{" "}
                                            formations
                                        </span>
                                    </div>
                                )}
                                {!!establishment.rating && (
                                    <div className="flex items-center gap-2">
                                        <Star className="size-5 text-muted-foreground" />
                                        <span>{establishment.rating} / 5</span>
                                    </div>
                                )}
                                {!!establishment.createdAt && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="size-5 text-muted-foreground" />
                                        <span>
                                            Ajouté le{" "}
                                            {new Date(
                                                establishment.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                                {!!establishment.sector && (
                                    <div className="flex items-center gap-2">
                                        <Award className="size-5 text-muted-foreground" />
                                        <span>
                                            Secteur: {establishment.sector.name}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <h3 className="mb-2 mt-6 text-xl font-semibold">
                                Équipements
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {facilities.map((facility, index) => (
                                    <Badge key={index} variant="secondary">
                                        <Building className="mr-1 size-3" />
                                        {facility}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="programs">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="programs">
                                Formations
                            </TabsTrigger>
                            <TabsTrigger value="stats">
                                Statistiques
                            </TabsTrigger>
                            <TabsTrigger value="reviews">Avis</TabsTrigger>
                        </TabsList>
                        <TabsContent className="mt-4" value="programs">
                            {/* <ProgramsList establishmentId={establishment.id || 0} /> */}
                        </TabsContent>
                        <TabsContent className="mt-4" value="stats">
                            {/* <EstablishmentStats establishmentId={establishment.id || 0} /> */}
                        </TabsContent>
                        <TabsContent className="mt-4" value="reviews">
                            {/* <EstablishmentReviews establishmentId={establishment.id || 0} /> */}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Colonne latérale */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Coordonnées</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 size-5 text-muted-foreground" />
                                <div>
                                    <p>
                                        {establishment.address ||
                                            "Adresse non disponible"}
                                    </p>
                                    {!!establishment.address && (
                                        <Button
                                            asChild
                                            className="h-auto p-0"
                                            variant="link"
                                        >
                                            <Link
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(establishment.address ?? "")}`}
                                                target="_blank"
                                            >
                                                Voir sur Google Maps
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {!!establishment.contacts &&
                                establishment.contacts[0] && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="size-5 text-muted-foreground" />
                                        <a
                                            className="hover:underline"
                                            href={`tel:${establishment.contacts[0]}`}
                                        >
                                            {establishment.contacts[0]}
                                        </a>
                                    </div>
                                )}

                            {!!establishment.siteUrl && (
                                <div className="flex items-center gap-3">
                                    <Globe className="size-5 text-muted-foreground" />
                                    <a
                                        className="hover:underline"
                                        href={establishment.siteUrl}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        Site web officiel
                                    </a>
                                </div>
                            )}

                            {/* Contact email - s'il existe dans l'API */}
                            {!!establishment.contacts &&
                                establishment.contacts.length > 1 && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="size-5 text-muted-foreground" />
                                        <a
                                            className="hover:underline"
                                            href={`mailto:${establishment.contacts[1]}`}
                                        >
                                            {establishment.contacts[1]}
                                        </a>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Localisation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative h-[200px] overflow-hidden rounded-md">
                                {!!establishment.latitude &&
                                !!establishment.longitude ? (
                                    <Image
                                        fill
                                        alt="Carte de localisation"
                                        className="object-cover"
                                        src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+f00(${establishment.longitude},${establishment.latitude})/${establishment.longitude},${establishment.latitude},13,0/400x200?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center bg-muted">
                                        <p className="text-muted-foreground">
                                            Localisation non disponible
                                        </p>
                                    </div>
                                )}
                                <div className="absolute bottom-2 right-2">
                                    <Button
                                        asChild
                                        size="sm"
                                        variant="secondary"
                                    >
                                        <Link
                                            href={`/map?id=${establishment.id}`}
                                        >
                                            Voir sur la carte
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {!!establishment.formations &&
                        establishment.formations.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Formations populaires</CardTitle>
                                    <CardDescription>
                                        Les formations les plus demandées
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {establishment.formations
                                        .slice(0, 3)
                                        .map((formation: any, i: number) => (
                                            <div
                                                key={i}
                                                className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                            >
                                                <h4 className="font-medium">
                                                    {formation.intitule}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {formation.description?.substring(
                                                        0,
                                                        60
                                                    )}
                                                    ...
                                                </p>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <Badge variant="outline">
                                                        Formation
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                    >
                                                        Détails
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                </CardContent>
                            </Card>
                        )}
                </div>
            </div>
        </div>
    );
}
