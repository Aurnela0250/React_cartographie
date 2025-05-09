import Image from "next/image";
import Link from "next/link";

import { FeaturedEstablishments } from "@/presentation/components/features/featured-establishments";
import { MapExplorer } from "@/presentation/components/features/map-explorer";
import { RecommendationSection } from "@/presentation/components/features/recommendation-section";
import { Stats } from "@/presentation/components/features/stats";
import { Button } from "@/presentation/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";

export default function HomePage() {
    return (
        <div className="space-y-8">
            <section className="relative h-[500px] overflow-hidden rounded-lg">
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary/80 to-primary/40" />
                <Image
                    fill
                    priority
                    alt="Enseignement supérieur background"
                    className="absolute inset-0 size-full object-cover object-center"
                    sizes="100vw"
                    src="http://www.tresorpublic.mg/tresorpublic/wp-content/uploads/2016/12/mesupres.jpg"
                />
                <div className="relative z-20 flex h-full flex-col items-center justify-center p-6 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
                        Trouvez votre voie dans l'enseignement supérieur
                    </h1>
                    <p className="mb-8 max-w-2xl text-xl text-white/90">
                        Explorez les établissements, découvrez les formations et
                        construisez votre avenir académique
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button asChild size="lg">
                            <Link href="/map">Explorer la carte</Link>
                        </Button>
                        <Button
                            asChild
                            className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                            size="lg"
                            variant="outline"
                        >
                            <Link href="/establishments">
                                Voir les établissements
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <div className="">
                {/* <Card>
                    <CardHeader>
                        <CardTitle>Recherche avancée</CardTitle>
                        <CardDescription>
                            Filtrez par région, type et formation
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SearchFilters compact />
                        <Button asChild className="mt-4 w-full">
                            <Link href="/search">Recherche complète</Link>
                        </Button>
                    </CardContent>
                </Card> */}

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Carte interactive</CardTitle>
                        <CardDescription>
                            Explorez les établissements par localisation
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <MapExplorer preview />
                    </CardContent>
                </Card>
            </div>

            <FeaturedEstablishments />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <RecommendationSection />
                <Stats />
            </div>
        </div>
    );
}
