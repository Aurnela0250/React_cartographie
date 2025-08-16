import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/presentation/components/ui/card";

export function InteractiveMapSection() {
    return (
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
                    <p className="text-muted-foreground mx-auto max-w-2xl">
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
                    <CardFooter className="bg-card flex justify-center p-4">
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
    );
}