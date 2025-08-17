import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FeaturedEstablishments } from "@/presentation/components/features/home/featured-establishments";
import { Button } from "@/presentation/components/ui/button";

export function FeaturedEstablishmentsSection() {
    return (
        <section
            aria-label="Établissements à la une"
            className="bg-background py-16"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                        Établissements à la une
                    </h2>
                    <p className="text-muted-foreground mx-auto max-w-2xl">
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
    );
}