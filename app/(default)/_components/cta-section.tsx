import Link from "next/link";

import { Button } from "@/presentation/components/ui/button";

export function CTASection() {
    return (
        <section className="bg-primary text-primary-foreground py-16">
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
                            className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
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
    );
}