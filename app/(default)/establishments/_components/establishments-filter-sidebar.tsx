import { Suspense } from "react";
import { Building, Filter, GraduationCap, MapPin, Layers, Shield } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Separator } from "@/presentation/components/ui/separator";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
} from "@/presentation/components/ui/sidebar";

import { CitiesFilter } from "./cities-filter";
import { CollapsibleFilterWrapper } from "./collapsible-filter-wrapper";
import { DomainsFilter } from "./domains-filter";
import { FilterSkeleton } from "./filter-skeleton";
import { LevelsFilter } from "./levels-filter";
import { EstablishmentTypesFilter } from "./establishment-types-filter";
import { StatusFilter } from "./status-filter";

export function EstablishmentsFilterSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader className="border-b">
                <div className="flex items-center gap-2 px-4 py-2">
                    <Filter className="size-5" />
                    <h2 className="text-lg font-semibold">Filtres</h2>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {/* Search Filter */}
                <SidebarGroup>
                    <SidebarGroupLabel>Recherche</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="px-3">
                            <Input
                                placeholder="Rechercher un établissement..."
                                className="w-full"
                            />
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>

                <Separator />

                {/* Cities Filter */}
                <CollapsibleFilterWrapper
                    icon={<MapPin className="size-4" />}
                    title="Villes"
                >
                    <Suspense fallback={<FilterSkeleton />}>
                        <CitiesFilter />
                    </Suspense>
                </CollapsibleFilterWrapper>

                <Separator />

                {/* Domains Filter */}
                <CollapsibleFilterWrapper
                    icon={<Building className="size-4" />}
                    title="Domaines"
                >
                    <Suspense fallback={<FilterSkeleton />}>
                        <DomainsFilter />
                    </Suspense>
                </CollapsibleFilterWrapper>

                <Separator />

                {/* Levels Filter */}
                <CollapsibleFilterWrapper
                    icon={<GraduationCap className="size-4" />}
                    title="Niveaux"
                >
                    <Suspense fallback={<FilterSkeleton />}>
                        <LevelsFilter />
                    </Suspense>
                </CollapsibleFilterWrapper>

                <Separator />

                {/* Status Filter */}
                <CollapsibleFilterWrapper
                    icon={<Shield className="size-4" />}
                    title="Statut"
                >
                    <Suspense fallback={<FilterSkeleton />}>
                        <StatusFilter />
                    </Suspense>
                </CollapsibleFilterWrapper>

                <Separator />

                {/* Establishment Types Filter */}
                <CollapsibleFilterWrapper
                    icon={<Layers className="size-4" />}
                    title="Types d'établissement"
                >
                    <Suspense fallback={<FilterSkeleton />}>
                        <EstablishmentTypesFilter />
                    </Suspense>
                </CollapsibleFilterWrapper>

                <Separator />

                {/* Filter Actions */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <div className="flex flex-col gap-2 px-3">
                            <Button className="w-full">
                                Appliquer les filtres
                            </Button>
                            <Button variant="outline" className="w-full">
                                Réinitialiser
                            </Button>
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
