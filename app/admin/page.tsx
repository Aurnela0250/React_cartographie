import {
    BookOpen,
    Building,
    Building2,
    CircleGauge,
    MapPinned,
    Settings2,
    University,
} from "lucide-react";

import { Badge } from "@/presentation/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";

function AdminPage() {
    const adminSections = [
        {
            title: "Régions",
            description: "Gérer les régions de Madagascar",
            icon: MapPinned,
            href: "/admin/regions",
            color: "bg-blue-500",
            count: "22", // Nombre de régions de Madagascar
        },
        {
            title: "Villes",
            description: "Gérer les villes et communes",
            icon: Building2,
            href: "/admin/cities",
            color: "bg-green-500",
            count: "200+",
        },
        {
            title: "Établissements",
            description: "Gérer les établissements d'enseignement",
            icon: Building,
            href: "/admin/establishments",
            color: "bg-purple-500",
            count: "150+",
        },
        {
            title: "Types d'établissement",
            description: "Catégories d'établissements",
            icon: University,
            href: "/admin/establishment-types",
            color: "bg-orange-500",
            count: "10",
        },
        {
            title: "Domaines",
            description: "Domaines d'étude disponibles",
            icon: BookOpen,
            href: "/admin/domains",
            color: "bg-cyan-500",
            count: "25+",
        },
        {
            title: "Niveaux",
            description: "Niveaux d'étude (Licence, Master, etc.)",
            icon: CircleGauge,
            href: "/admin/levels",
            color: "bg-red-500",
            count: "5",
        },
        {
            title: "Mentions",
            description: "Mentions et spécialisations",
            icon: Settings2,
            href: "/admin/mentions",
            color: "bg-yellow-500",
            count: "50+",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Administration
                </h1>
                <p className="text-muted-foreground">
                    Gérez les données de la plateforme OrientaMada
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {adminSections.map((section) => {
                    const Icon = section.icon;

                    return (
                        <Card
                            key={section.title}
                            className="transition-all hover:shadow-md"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`inline-flex rounded-lg p-2 ${section.color} text-white`}
                                    >
                                        <Icon className="size-5" />
                                    </div>
                                    <Badge variant="secondary">
                                        {section.count}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg">
                                    {section.title}
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    {section.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <a
                                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                                    href={section.href}
                                >
                                    Gérer →
                                </a>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Statistiques rapides</CardTitle>
                    <CardDescription>
                        Aperçu des données de la plateforme
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                22
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Régions
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                200+
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Villes
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                150+
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Établissements
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                500+
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Formations
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default AdminPage;
