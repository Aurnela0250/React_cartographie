import { Award, BookOpen } from "lucide-react";

import { RecommendationSection } from "@/presentation/components/features/recommendation-section";
import { Stats } from "@/presentation/components/features/stats";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";

export function InformationSection() {
    return (
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
                                    <Award className="text-primary mr-2 size-5" />
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
                                    <BookOpen className="text-primary mr-2 size-5" />
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
    );
}