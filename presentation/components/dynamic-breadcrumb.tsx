"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/presentation/components/ui/breadcrumb";

// Configuration complète des labels de routes
const routeLabels: Record<string, string> = {
    admin: "Administration",
    regions: "Régions",
    cities: "Villes",
    establishments: "Établissements",
    "establishment-types": "Types d'établissement",
    domains: "Domaines",
    levels: "Niveaux",
    mentions: "Mentions",
    formations: "Formations",
    edit: "Modifier",
    create: "Créer",
    view: "Voir",
    settings: "Paramètres",
    users: "Utilisateurs",
    profile: "Profil",
};

// Configuration des contextes pour les IDs
const contextLabels: Record<string, (id: string) => string> = {
    regions: (id: string) => `Région #${id}`,
    cities: (id: string) => `Ville #${id}`,
    establishments: (id: string) => `Établissement #${id}`,
    "establishment-types": (id: string) => `Type #${id}`,
    domains: (id: string) => `Domaine #${id}`,
    levels: (id: string) => `Niveau #${id}`,
    mentions: (id: string) => `Mention #${id}`,
    formations: (id: string) => `Formation #${id}`,
};

interface DynamicBreadcrumbProps {
    className?: string;
}

export function DynamicBreadcrumb({ className }: DynamicBreadcrumbProps) {
    const pathname = usePathname();

    // Ne pas afficher si on n'est pas dans l'admin
    if (!pathname.startsWith("/admin")) {
        return null;
    }

    // Diviser le chemin en segments et filtrer les segments vides
    const segments = pathname.split("/").filter(Boolean);

    // Construire les breadcrumbs
    const breadcrumbs = segments.map((segment, index) => {
        const path = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;
        const isId = /^\d+$/.test(segment) || /^[0-9a-f-]{36}$/i.test(segment);

        let label = routeLabels[segment] || segment;

        // Si c'est un ID, utiliser le contexte précédent pour générer un label approprié
        if (isId && index > 0) {
            const previousSegment = segments[index - 1];
            const contextLabelFunc = contextLabels[previousSegment];

            if (contextLabelFunc) {
                label = contextLabelFunc(segment);
            } else {
                label = `#${segment.slice(0, 8)}${segment.length > 8 ? "..." : ""}`;
            }
        }

        return {
            label,
            path,
            isLast,
            segment,
            isId,
        };
    });

    return (
        <Breadcrumb className={className}>
            <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.path} className="flex items-center">
                        <BreadcrumbItem>
                            {crumb.isLast ? (
                                <BreadcrumbPage className="font-medium text-foreground">
                                    {crumb.label}
                                </BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link
                                        className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                                        href={crumb.path}
                                    >
                                        {index === 0 && (
                                            <Home className="size-4" />
                                        )}
                                        <span>{crumb.label}</span>
                                    </Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        {!crumb.isLast && (
                            <BreadcrumbSeparator className="mx-2">
                                <ChevronRight className="size-4 text-muted-foreground" />
                            </BreadcrumbSeparator>
                        )}
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

// Export par défaut
export default DynamicBreadcrumb;
