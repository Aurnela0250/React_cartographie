import Image from "next/image";

import {
    Card,
    CardContent,
} from "@/presentation/components/ui/card";

export function TestimonialsSection() {
    return (
        <section className="bg-primary/5 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                        Ce que disent nos utilisateurs
                    </h2>
                    <p className="text-muted-foreground mx-auto max-w-2xl">
                        Découvrez comment notre plateforme aide les
                        étudiants à trouver leur voie
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="mb-4 flex items-center">
                                <div className="bg-primary/10 mr-4 size-12 overflow-hidden rounded-full">
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
                                    <p className="text-muted-foreground text-sm">
                                        Étudiant en informatique
                                    </p>
                                </div>
                            </div>
                            <p className="text-muted-foreground italic">
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
                                <div className="bg-primary/10 mr-4 size-12 overflow-hidden rounded-full">
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
                                    <p className="text-muted-foreground text-sm">
                                        Étudiante en gestion
                                    </p>
                                </div>
                            </div>
                            <p className="text-muted-foreground italic">
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
                                <div className="bg-primary/10 mr-4 size-12 overflow-hidden rounded-full">
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
                                    <p className="text-muted-foreground text-sm">
                                        Parent d'étudiant
                                    </p>
                                </div>
                            </div>
                            <p className="text-muted-foreground italic">
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
    );
}