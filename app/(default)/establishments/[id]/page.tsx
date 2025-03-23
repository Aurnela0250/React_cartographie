import {
  Award,
  BookOpen,
  Building,
  Calendar,
  Globe,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import Link from "next/link";

import { EstablishmentGallery } from "@/presentation/components/features/establishment-gallery";
import { EstablishmentReviews } from "@/presentation/components/features/establishment-reviews";
import { EstablishmentStats } from "@/presentation/components/features/establishment-stats";
import { ProgramsList } from "@/presentation/components/features/programs-list";
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

export default function EstablishmentPage({
  params,
}: { params: { id: string } }) {
  // In a real app, you would fetch the establishment data based on the ID
  const establishment = {
    id: params.id,
    name: "Université d'Antananarivo",
    type: "Université",
    address: "Ankatso",
    phone: "+261 38 91 600 07",
    website: "https://www.universite-ankatso.mg",
    email: "contact@universite-ankatso.mg",
    description:
      "L'Université d'Ankatso est une université publique malgache située dans la capitale de Madagascar qui est Antananarivo. Elle est classée parmi les meilleures universités de Madagascar dans plusieurs disciplines.",
    students: 48000,
    programs: 350,
    founded: 2019,
    accreditations: ["CTI", "HCERES", "EUR-ACE"],
    facilities: [
      "Bibliothèque",
      "Laboratoires",
      "Résidences",
      "Restaurants",
      "Installations sportives",
    ],
    coordinates: { lat: 48.712, lng: 2.213 },
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline">{establishment.type}</Badge>
            <Link
              href="/map"
              className="text-sm text-muted-foreground hover:underline"
            >
              Retour à la carte
            </Link>
          </div>
          <h1 className="text-3xl font-bold">{establishment.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Ajouter aux favoris</Button>
          <Button>Demander des informations</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <EstablishmentGallery images={establishment.images} />

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-2xl font-semibold">À propos</h2>
              <p className="text-muted-foreground">
                {establishment.description}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>
                    {establishment.students.toLocaleString()} étudiants
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <span>{establishment.programs} formations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>Fondé en {establishment.founded}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  <span>{establishment.accreditations.join(", ")}</span>
                </div>
              </div>

              <h3 className="mb-2 mt-6 text-xl font-semibold">Équipements</h3>
              <div className="flex flex-wrap gap-2">
                {establishment.facilities.map((facility, index) => (
                  <Badge key={index} variant="secondary">
                    <Building className="mr-1 h-3 w-3" />
                    {facility}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="programs">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="programs">Formations</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
              <TabsTrigger value="reviews">Avis</TabsTrigger>
            </TabsList>
            <TabsContent value="programs" className="mt-4">
              <ProgramsList establishmentId={establishment.id} />
            </TabsContent>
            <TabsContent value="stats" className="mt-4">
              <EstablishmentStats establishmentId={establishment.id} />
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <EstablishmentReviews establishmentId={establishment.id} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Coordonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p>{establishment.address}</p>
                  <Button variant="link" className="h-auto p-0" asChild>
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(establishment.address)}`}
                      target="_blank"
                    >
                      Voir sur Google Maps
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <a
                  href={`tel:${establishment.phone}`}
                  className="hover:underline"
                >
                  {establishment.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <a
                  href={establishment.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Site web officiel
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a
                  href={`mailto:${establishment.email}`}
                  className="hover:underline"
                >
                  {establishment.email}
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Localisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-[200px] overflow-hidden rounded-md bg-muted">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=400')] bg-cover bg-center" />
                <div className="absolute bottom-2 right-2">
                  <Button size="sm" variant="secondary" asChild>
                    <Link href="/map">Voir sur la carte</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formations recommandées</CardTitle>
              <CardDescription>Basées sur votre profil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <h4 className="font-medium">Master en Informatique</h4>
                  <p className="text-sm text-muted-foreground">
                    Spécialité Intelligence Artificielle
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline">Bac+5</Badge>
                    <Button variant="ghost" size="sm">
                      Détails
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
