import Link from "next/link";

import { DashboardChart } from "@/presentation/components/features/dashboard-chart";
import { DashboardStats } from "@/presentation/components/features/dashboard-stats";
import { EstablishmentTable } from "@/presentation/components/features/establishment-table";
import { RecentActivity } from "@/presentation/components/features/recent-activity";
import { UserTable } from "@/presentation/components/features/user-table";
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

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold">Tableau de bord</h1>
                    <p className="text-muted-foreground">
                        Bienvenue sur votre espace d'administration
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href="/dashboard/reports">Rapports</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard/settings">Paramètres</Link>
                    </Button>
                </div>
            </div>

            <DashboardStats />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Évolution des inscriptions</CardTitle>
                        <CardDescription>
                            Tendances sur les 12 derniers mois
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <DashboardChart type="enrollments" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Répartition par filière</CardTitle>
                        <CardDescription>
                            Distribution des étudiants par domaine d'étude
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <DashboardChart type="distribution" />
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Activité récente</CardTitle>
                        <CardDescription>
                            Dernières actions sur la plateforme
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentActivity />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Prévisions IA</CardTitle>
                        <CardDescription>
                            Tendances anticipées pour l'année à venir
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="rounded-lg border p-3">
                                <h4 className="font-medium">
                                    Hausse des inscriptions
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    +12% prévus en informatique
                                </p>
                                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                                    <div
                                        className="h-2 rounded-full bg-primary"
                                        style={{ width: "72%" }}
                                    />
                                </div>
                            </div>

                            <div className="rounded-lg border p-3">
                                <h4 className="font-medium">
                                    Secteurs en croissance
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    IA, Cybersécurité, Développement durable
                                </p>
                                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                                    <div
                                        className="h-2 rounded-full bg-primary"
                                        style={{ width: "85%" }}
                                    />
                                </div>
                            </div>

                            <div className="rounded-lg border p-3">
                                <h4 className="font-medium">
                                    Régions attractives
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Antananarivo, Fianarantsoa
                                </p>
                                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                                    <div
                                        className="h-2 rounded-full bg-primary"
                                        style={{ width: "63%" }}
                                    />
                                </div>
                            </div>

                            <Button className="w-full" variant="outline">
                                Voir l'analyse complète
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="establishments">
                <TabsList>
                    <TabsTrigger value="establishments">
                        Établissements
                    </TabsTrigger>
                    <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                </TabsList>
                <TabsContent className="mt-4" value="establishments">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>
                                    Gestion des établissements
                                </CardTitle>
                                <CardDescription>
                                    Liste des établissements enregistrés
                                </CardDescription>
                            </div>
                            <Button>Ajouter un établissement</Button>
                        </CardHeader>
                        <CardContent>
                            <EstablishmentTable />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent className="mt-4" value="users">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Gestion des utilisateurs</CardTitle>
                                <CardDescription>
                                    Liste des utilisateurs de la plateforme
                                </CardDescription>
                            </div>
                            <Button>Ajouter un utilisateur</Button>
                        </CardHeader>
                        <CardContent>
                            <UserTable />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
