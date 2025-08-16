import Link from "next/link";
import { ArrowRight, BookOpen, MapPin, School } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";

export function KeyFeaturesSection() {
    return (
        <section className="bg-background py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                        Comment pouvons-nous vous aider ?
                    </h2>
                    <p className="text-muted-foreground mx-auto max-w-2xl">
                        Découvrez les outils et ressources pour vous guider
                        dans votre parcours académique
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    <Card className="group transition-all hover:shadow-md">
                        <CardHeader className="text-center">
                            <div className="bg-primary/10 text-primary mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
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
                            <div className="bg-primary/10 text-primary mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
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
                            <div className="bg-primary/10 text-primary mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
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
    );
}