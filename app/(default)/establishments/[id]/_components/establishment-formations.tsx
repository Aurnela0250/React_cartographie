import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";

import { getInjection } from "@/di/container";
import { Card, CardContent } from "@/presentation/components/ui/card";
import {
    AuthenticationError,
    UnauthenticatedError,
} from "@/src/entities/errors/auth";
import type { Establishment } from "@/src/entities/models/establishment.entity";
import type { Formation } from "@/src/entities/models/formation.entity";
import type { Level } from "@/src/entities/models/level.entity";
import { DEFAULT_LOGOUT_REDIRECT } from "@/core/constants/route";

interface EstablishmentFormationsProps {
    establishment: Establishment;
}

// Server-side data fetching function for formations
async function filterFormations(establishmentId: number) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };
        }

        const filterFormationsController = getInjection(
            "IFilterFormationsController"
        );

        const result = await filterFormationsController(accessToken, {
            filters: { establishmentId },
            params: { page: 1, perPage: 100 },
        });

        return result;
    } catch (error) {
        if (
            error instanceof UnauthenticatedError ||
            error instanceof AuthenticationError
        ) {
            redirect(DEFAULT_LOGOUT_REDIRECT);
        }
        throw error;
    }
}

// Server-side data fetching function for level
async function getLevel(levelId: number) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return null;
    }

    const getLevelController = getInjection("IGetLevelController");

    try {
        const level = await getLevelController(accessToken, levelId);
        return level;
    } catch (error) {
        console.error("Error fetching level:", error);
        return null;
    }
}

// Helper function to convert duration from months to display format
function formatDuration(months: number | undefined | null): string {
    if (!months || months === 0) {
        return "aucune";
    }
    return `${months} mois`;
}

// Formation card component
interface FormationCardProps {
    formation: Formation;
    level: Level | null;
    establishment: Establishment;
}

function FormationCard({
    formation,
    level,
    establishment,
}: FormationCardProps) {
    return (
        <div className="bg-background border-border rounded-xl border p-6 transition-shadow hover:shadow-md">
            <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                        <GraduationCap className="text-primary h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-foreground text-lg font-semibold">
                            {formation.name}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                            {level ? `${level.name}` : "Niveau non spécifié"}
                        </p>
                    </div>
                </div>
                <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                    {formatDuration(formation.duration)}
                </span>
            </div>
            <p className="text-muted-foreground">
                {formation.description || "Aucune description disponible."}
            </p>
            <div className="mt-4 flex justify-end">
                {formation.link || establishment.website ? (
                    <a
                        href={formation.link || establishment.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 text-sm font-medium"
                    >
                        En savoir plus →
                    </a>
                ) : (
                    <span className="text-muted-foreground text-sm font-medium">
                        Lien non disponible
                    </span>
                )}
            </div>
        </div>
    );
}

// Main formations display component
async function FormationsDisplay({
    establishment,
}: EstablishmentFormationsProps) {
    try {
        const formationsResult = await filterFormations(establishment.id);
        const formations = formationsResult.items;

        if (!formations || formations.length === 0) {
            return (
                <Card className="bg-card border-border rounded-2xl border">
                    <CardContent className="space-y-4 p-6">
                        <h3 className="text-foreground mb-6 text-xl font-semibold">
                            Formations disponibles (0)
                        </h3>
                        <div className="py-8 text-center">
                            <GraduationCap className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                            <p className="text-muted-foreground">
                                Aucune formation disponible pour cet
                                établissement.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        // Fetch all levels in parallel for optimization
        const uniqueLevelIds = [...new Set(formations.map((f) => f.levelId))];
        const levelPromises = uniqueLevelIds.map((levelId) =>
            getLevel(levelId)
        );
        const levels = await Promise.all(levelPromises);

        // Create a map for quick level lookup
        const levelMap = new Map<number, Level | null>();
        uniqueLevelIds.forEach((levelId, index) => {
            levelMap.set(levelId, levels[index]);
        });

        return (
            <Card className="bg-card border-border rounded-2xl border">
                <CardContent className="space-y-4 p-6">
                    <h3 className="text-foreground mb-6 text-xl font-semibold">
                        Formations disponibles ({formations.length})
                    </h3>

                    <div className="space-y-4">
                        {formations.map((formation) => (
                            <FormationCard
                                key={formation.id}
                                formation={formation}
                                level={levelMap.get(formation.levelId) || null}
                                establishment={establishment}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    } catch (error) {
        console.error("Error fetching formations:", error);
        return (
            <Card className="bg-card border-border rounded-2xl border">
                <CardContent className="space-y-4 p-6">
                    <h3 className="text-foreground mb-6 text-xl font-semibold">
                        Formations disponibles
                    </h3>
                    <div className="py-8 text-center">
                        <p className="text-muted-foreground">
                            Erreur lors du chargement des formations.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }
}

export function EstablishmentFormations({
    establishment,
}: EstablishmentFormationsProps) {
    return <FormationsDisplay establishment={establishment} />;
}
