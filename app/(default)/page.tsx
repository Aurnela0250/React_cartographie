import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Award,
    BookOpen,
    MapPin,
    School,
    Search,
} from "lucide-react";

import { EstablishmentSearch } from "@/presentation/components/features/home/establishment-search";
import { FeaturedEstablishments } from "@/presentation/components/features/home/featured-establishments";
import { RecommendationSection } from "@/presentation/components/features/recommendation-section";
import { Stats } from "@/presentation/components/features/stats";
import { Button } from "@/presentation/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";
import { Input } from "@/presentation/components/ui/input";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/presentation/components/ui/tabs";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
            {/* Hero Section - Redesigned with search functionality */}
            <section
                aria-labelledby="hero-title"
                className="relative overflow-hidden bg-primary/5 pb-24 pt-16 md:pb-32 md:pt-20"
            >
                <div className="absolute inset-0 z-0 bg-[url('/hero-pattern.png')] opacity-5" />
                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <h1
                            className="mb-6 text-4xl font-bold tracking-tight text-primary md:text-5xl lg:text-6xl"
                            id="hero-title"
                        >
                            Votre avenir commence ici
                        </h1>
                        <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
                            Découvrez et comparez les meilleures formations et
                            établissements d'enseignement supérieur à Madagascar
                        </p>

                        {/* Search Component */}
                        <div className="mx-auto mb-8 max-w-2xl">
                            <div className="relative">
                                <div className="flex items-center rounded-lg border bg-card p-1 shadow-sm">
                                    <Tabs
                                        className="w-full"
                                        defaultValue="establishment"
                                    >
                                        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                                            <TabsTrigger value="establishment">
                                                Établissement
                                            </TabsTrigger>
                                            <TabsTrigger value="program">
                                                Formation
                                            </TabsTrigger>
                                            <TabsTrigger value="location">
                                                Localisation
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent
                                            className="mt-0 p-2"
                                            value="establishment"
                                        >
                                            <EstablishmentSearch />
                                        </TabsContent>
                                        <TabsContent
                                            className="mt-0 p-2"
                                            value="program"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
                                                    placeholder="Rechercher une formation..."
                                                />
                                                <Button size="sm">
                                                    <Search className="mr-2 size-4" />
                                                    Rechercher
                                                </Button>
                                            </div>
                                        </TabsContent>
                                        <TabsContent
                                            className="mt-0 p-2"
                                            value="location"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
                                                    placeholder="Rechercher par ville ou région..."
                                                />
                                                <Button size="sm">
                                                    <Search className="mr-2 size-4" />
                                                    Rechercher
                                                </Button>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div className="rounded-lg bg-card p-4 shadow-sm">
                                <p className="text-3xl font-bold text-primary">
                                    150+
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Établissements
                                </p>
                            </div>
                            <div className="rounded-lg bg-card p-4 shadow-sm">
                                <p className="text-3xl font-bold text-primary">
                                    500+
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Formations
                                </p>
                            </div>
                            <div className="rounded-lg bg-card p-4 shadow-sm">
                                <p className="text-3xl font-bold text-primary">
                                    25+
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Villes
                                </p>
                            </div>
                            <div className="rounded-lg bg-card p-4 shadow-sm">
                                <p className="text-3xl font-bold text-primary">
                                    10k+
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Étudiants
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Features Section */}
            <section className="bg-background py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                            Comment pouvons-nous vous aider ?
                        </h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            Découvrez les outils et ressources pour vous guider
                            dans votre parcours académique
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <Card className="group transition-all hover:shadow-md">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <MapPin className="size-6" />
                                </div>
                                <CardTitle>Carte Interactive</CardTitle>
                                <CardDescription>
                                    Explorez les établissements par localisation
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-muted-foreground">
                                    Visualisez et filtrez les établissements sur
                                    une carte interactive pour trouver ceux qui
                                    sont proches de chez vous.
                                </p>
                            </CardContent>
                            <CardFooter className="justify-center pt-0">
                                <Button
                                    asChild
                                    className="group-hover:bg-primary/10"
                                    variant="ghost"
                                >
                                    <Link
                                        className="flex items-center"
                                        href="/map"
                                    >
                                        Explorer la carte
                                        <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card className="group transition-all hover:shadow-md">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <School className="size-6" />
                                </div>
                                <CardTitle>Établissements</CardTitle>
                                <CardDescription>
                                    Découvrez les établissements d'enseignement
                                    supérieur
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-muted-foreground">
                                    Consultez les profils détaillés des
                                    établissements, leurs formations, et les
                                    avis des étudiants.
                                </p>
                            </CardContent>
                            <CardFooter className="justify-center pt-0">
                                <Button
                                    asChild
                                    className="group-hover:bg-primary/10"
                                    variant="ghost"
                                >
                                    <Link
                                        className="flex items-center"
                                        href="/establishments"
                                    >
                                        Voir les établissements
                                        <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card className="group transition-all hover:shadow-md">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <BookOpen className="size-6" />
                                </div>
                                <CardTitle>Formations</CardTitle>
                                <CardDescription>
                                    Explorez les différentes formations
                                    disponibles
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-muted-foreground">
                                    Comparez les programmes, les débouchés
                                    professionnels et trouvez la formation qui
                                    correspond à vos aspirations.
                                </p>
                            </CardContent>
                            <CardFooter className="justify-center pt-0">
                                <Button
                                    asChild
                                    className="group-hover:bg-primary/10"
                                    variant="ghost"
                                >
                                    <Link
                                        className="flex items-center"
                                        href="/programs"
                                    >
                                        Explorer les formations
                                        <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Interactive Map Section - Enhanced */}
            <section
                aria-labelledby="interactive-map-heading"
                className="bg-primary/5 py-16"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 text-center">
                        <h2
                            className="mb-4 text-3xl font-bold tracking-tight md:text-4xl"
                            id="interactive-map-heading"
                        >
                            Explorez la carte des établissements
                        </h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            Visualisez la répartition géographique des
                            établissements d'enseignement supérieur à Madagascar
                        </p>
                    </div>

                    <Card className="overflow-hidden border-0 shadow-lg">
                        <CardContent className="p-0">
                            <div className="h-[450px] md:h-[500px]">
                                {/* <MapExplorer preview /> */}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center bg-card p-4">
                            <Button asChild>
                                <Link className="flex items-center" href="/map">
                                    Accéder à la carte complète
                                    <ArrowRight className="ml-2 size-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </section>

            {/* Featured Establishments - Enhanced */}
            <section
                aria-label="Établissements à la une"
                className="bg-background py-16"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 text-center">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                            Établissements à la une
                        </h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            Découvrez les établissements les plus populaires et
                            les mieux notés
                        </p>
                    </div>

                    <FeaturedEstablishments />

                    <div className="mt-12 text-center">
                        <Button asChild size="lg">
                            <Link
                                className="flex items-center"
                                href="/establishments"
                            >
                                Voir tous les établissements
                                <ArrowRight className="ml-2 size-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Testimonials Section - New */}
            <section className="bg-primary/5 py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 text-center">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                            Ce que disent nos utilisateurs
                        </h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            Découvrez comment notre plateforme aide les
                            étudiants à trouver leur voie
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-center">
                                    <div className="mr-4 size-12 overflow-hidden rounded-full bg-primary/10">
                                        <Image
                                            alt="Avatar"
                                            className="size-full object-cover"
                                            height={48}
                                            src="/placeholder.svg?height=48&width=48"
                                            width={48}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            Rakoto Jean
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Étudiant en informatique
                                        </p>
                                    </div>
                                </div>
                                <p className="italic text-muted-foreground">
                                    "Grâce à cette plateforme, j'ai pu découvrir
                                    des formations en informatique que je ne
                                    connaissais pas. J'ai trouvé l'établissement
                                    parfait pour mes études !"
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-center">
                                    <div className="mr-4 size-12 overflow-hidden rounded-full bg-primary/10">
                                        <Image
                                            alt="Avatar"
                                            className="size-full object-cover"
                                            height={48}
                                            src="/placeholder.svg?height=48&width=48"
                                            width={48}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            Rasoa Marie
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Étudiante en gestion
                                        </p>
                                    </div>
                                </div>
                                <p className="italic text-muted-foreground">
                                    "La carte interactive m'a permis de trouver
                                    un établissement proche de chez moi. Les
                                    informations détaillées m'ont aidée à faire
                                    le bon choix pour mon avenir."
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-center">
                                    <div className="mr-4 size-12 overflow-hidden rounded-full bg-primary/10">
                                        <Image
                                            alt="Avatar"
                                            className="size-full object-cover"
                                            height={48}
                                            src="/placeholder.svg?height=48&width=48"
                                            width={48}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            Rabe Pascal
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Parent d'étudiant
                                        </p>
                                    </div>
                                </div>
                                <p className="italic text-muted-foreground">
                                    "En tant que parent, cette plateforme m'a
                                    aidé à conseiller mon fils dans son
                                    orientation. Les comparaisons entre
                                    établissements sont très utiles !"
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Information Section - Redesigned */}
            <section
                aria-label="Informations complémentaires"
                className="bg-background py-16"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <div>
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Award className="mr-2 size-5 text-primary" />
                                        Recommandations personnalisées
                                    </CardTitle>
                                    <CardDescription>
                                        Trouvez les formations qui correspondent
                                        à votre profil
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RecommendationSection />
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <BookOpen className="mr-2 size-5 text-primary" />
                                        Statistiques de l'enseignement supérieur
                                    </CardTitle>
                                    <CardDescription>
                                        Chiffres clés et tendances du secteur
                                        éducatif
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Stats />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - New */}
            <section className="bg-primary py-16 text-primary-foreground">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                            Prêt à commencer votre parcours académique ?
                        </h2>
                        <p className="mb-8 text-xl opacity-90">
                            Explorez les meilleures options pour votre avenir
                            dès maintenant
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button asChild size="lg" variant="secondary">
                                <Link href="/map">Explorer la carte</Link>
                            </Button>
                            <Button
                                asChild
                                className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                                size="lg"
                                variant="outline"
                            >
                                <Link href="/establishments">
                                    Voir les établissements
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
