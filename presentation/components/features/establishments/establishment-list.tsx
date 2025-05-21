"use client";

import { useState } from "react";
import {
    Building,
    Filter,
    Loader2,
    MapPin,
    School,
    Search,
    X,
} from "lucide-react";

import { SearchFilters } from "@/presentation/components/features/search-filters";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { Input } from "@/presentation/components/ui/input";
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "@/presentation/components/ui/popover";
import { Separator } from "@/presentation/components/ui/separator";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import {
    FilterParams,
    useFilterEstablishments,
} from "@/presentation/hooks/useFilterEstablishments";

import { EstablishmentCard } from "./establishment-card";

const ITEMS_PER_PAGE = 12;

export function EstablishmentList() {
    const [filters, setFilters] = useState<FilterParams>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    const {
        data,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        error,
        refetch,
        isError,
    } = useFilterEstablishments({ filters, perPage: ITEMS_PER_PAGE });

    const establishments = data?.pages.flatMap((p) => p.items) ?? [];

    const loadMoreItems = () => {
        if (hasNextPage && !isFetchingNextPage && !isLoading && !isError) {
            fetchNextPage();
        }
    };

    const resetItemsAndFilters = () => {
        setFilters({});
        setSearchTerm("");
        setActiveFilters([]);
        // Le useEffect ci-dessus s'occupera de réinitialiser la page et de fetcher
    };

    const retryFetch = () => {
        refetch();
    };

    const handleFilterChange = (newFilters: FilterParams) => {
        setFilters(newFilters);
        // Mettre à jour les badges de filtres actifs
        const badges: string[] = [];

        if (newFilters.name) badges.push(`Nom: ${newFilters.name}`);
        if (newFilters.regionId) {
            const regionId = newFilters.regionId;

            badges.push(`Région: ${regionId}`);
        }
        if (newFilters.establishmentTypeId) {
            const typeId = newFilters.establishmentTypeId;

            badges.push(`Type: ${typeId}`);
        }
        setActiveFilters(badges);
        setIsFilterOpen(false);
    };

    const handleSearch = () => {
        setFilters((prev) => ({
            ...prev,
            name: searchTerm || undefined,
        }));
    };

    const clearFiltersAndSearch = () => {
        setFilters({});
        setSearchTerm("");
        setActiveFilters([]);
        // Le useEffect pour les filtres s'occupera du reste
    };

    const removeFilter = (filterToRemove: string) => {
        const type = filterToRemove.split(":")[0].trim();
        const updatedFilters = { ...filters };

        if (type === "Nom") {
            delete updatedFilters.name;
            setSearchTerm("");
        } else if (type === "Région") {
            delete updatedFilters.regionId;
        } else if (type === "Type") {
            delete updatedFilters.establishmentTypeId;
        }

        setFilters(updatedFilters);
        setActiveFilters(activeFilters.filter((f) => f !== filterToRemove));
    };

    const renderGridSkeletons = (count = ITEMS_PER_PAGE) => {
        // S'assurer que le count est ITEMS_PER_PAGE
        return Array.from({ length: count }).map((_, index) => (
            <Card
                key={`grid-skeleton-${index}`}
                className="overflow-hidden border-none shadow-md transition-all"
            >
                <Skeleton className="h-40 w-full rounded-t-lg" />
                <CardContent className="p-5">
                    <div className="mb-3 flex items-start justify-between">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-10 rounded-full" />
                    </div>
                    <Skeleton className="mb-2 h-6 w-3/4" />
                    <Skeleton className="mb-3 h-4 w-2/3" />
                    <Skeleton className="mb-4 h-4 w-1/2" />
                    <div className="flex gap-2">
                        <Skeleton className="h-9 flex-1 rounded-full" />
                        <Skeleton className="h-9 flex-1 rounded-full" />
                    </div>
                </CardContent>
            </Card>
        ));
    };

    return (
        <div className="space-y-8">
            <div className="rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-bold text-slate-800">
                    Établissements
                </h2>
                <div className="flex flex-wrap gap-3">
                    <div className="relative grow basis-64">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            aria-label="Rechercher un établissement"
                            className="h-11 rounded-lg border-slate-200 bg-white pl-10 pr-4 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-violet-500"
                            placeholder="Rechercher un établissement..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            className="h-11 rounded-lg bg-violet-600 px-4 font-medium text-white shadow-sm transition-all hover:bg-violet-700"
                            variant="default"
                            onClick={handleSearch}
                        >
                            <Search className="mr-2 size-4" />
                            Rechercher
                        </Button>
                        <Popover
                            open={isFilterOpen}
                            onOpenChange={setIsFilterOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    aria-label="Ouvrir les filtres"
                                    className="h-11 rounded-lg border-slate-200 bg-white px-4 font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50"
                                    variant="outline"
                                >
                                    <Filter className="mr-2 size-4 text-slate-500" />
                                    Filtres
                                    {activeFilters.length > 0 && (
                                        <span className="ml-1.5 flex size-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                                            {activeFilters.length}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                align="end"
                                className="w-80 rounded-xl border-slate-200 p-0 shadow-lg"
                                sideOffset={8}
                            >
                                <div className="p-4 pb-0">
                                    <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                                        <h3 className="text-lg font-semibold text-slate-800">
                                            Filtres avancés
                                        </h3>
                                        <PopoverClose asChild>
                                            <Button
                                                className="size-8 rounded-full hover:bg-slate-100"
                                                size="icon"
                                                variant="ghost"
                                            >
                                                <X className="size-4 text-slate-500" />
                                                <span className="sr-only">
                                                    Fermer
                                                </span>
                                            </Button>
                                        </PopoverClose>
                                    </div>
                                    <SearchFilters
                                        onFilterChange={handleFilterChange}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            {activeFilters.length > 0 && (
                <div className="flex w-full flex-wrap gap-2">
                    {activeFilters.map((filter) => {
                        const [type] = filter.split(":");
                        let icon = <Building className="mr-1.5 size-3.5" />;

                        if (type.trim() === "Région") {
                            icon = <MapPin className="mr-1.5 size-3.5" />;
                        } else if (type.trim() === "Type") {
                            icon = <School className="mr-1.5 size-3.5" />;
                        }

                        return (
                            <Badge
                                key={filter}
                                className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
                                variant="secondary"
                            >
                                <span className="flex items-center">
                                    {icon}
                                    {filter}
                                </span>
                                <button
                                    aria-label={`Supprimer le filtre ${filter}`}
                                    className="ml-2 rounded-full p-0.5 hover:bg-slate-300 hover:text-slate-900"
                                    onClick={() => removeFilter(filter)}
                                >
                                    <X className="size-3.5" />
                                </button>
                            </Badge>
                        );
                    })}
                    <Button
                        className="rounded-full border-none px-3 py-1.5 text-sm font-medium text-violet-600 hover:bg-violet-50 hover:text-violet-700"
                        size="sm"
                        variant="ghost"
                        onClick={clearFiltersAndSearch}
                    >
                        Effacer tout
                    </Button>
                </div>
            )}

            {/* Affichage conditionnel basé sur l'état de chargement et les erreurs */}

            {isLoading && establishments.length === 0 && !error && (
                <div
                    aria-busy="true"
                    aria-live="polite"
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                    {renderGridSkeletons()}
                </div>
            )}

            {error && (
                <div className="rounded-xl bg-red-50 p-4 text-center text-red-600 shadow-sm">
                    <p className="font-medium">
                        {error.message || "Erreur inconnue"}
                    </p>
                    <Button
                        className="mt-2 bg-white text-red-600 hover:bg-red-100"
                        size="sm"
                        variant="outline"
                        onClick={retryFetch}
                    >
                        Réessayer
                    </Button>
                </div>
            )}

            {!isLoading && establishments.length === 0 && !error && (
                <div className="rounded-xl bg-slate-50 p-10 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-slate-100">
                        <Search className="size-8 text-slate-400" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-slate-800">
                        Aucun résultat trouvé
                    </h3>
                    <p className="mb-6 text-slate-500">
                        Aucun établissement ne correspond aux critères de
                        recherche actuels.
                    </p>
                    <Button
                        className="rounded-lg bg-violet-600 px-6 py-2.5 font-medium text-white hover:bg-violet-700"
                        onClick={clearFiltersAndSearch}
                    >
                        Réinitialiser les filtres
                    </Button>
                </div>
            )}

            {/* Afficher la liste et le bouton "Afficher plus" si pas de chargement initial et pas d'erreur grave au premier chargement */}
            {establishments.length > 0 && !error && (
                <>
                    {/* Compteur de résultats - s'assurer qu'il ne s'affiche pas pendant le chargement initial */}
                    {!isLoading && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-500">
                                {establishments.length} établissement
                                {establishments.length > 1 ? "s" : ""} trouvé
                                {establishments.length > 1 ? "s" : ""}
                            </p>
                            <Separator className="mx-4 flex-1" />
                        </div>
                    )}

                    <div
                        aria-busy={isFetchingNextPage}
                        aria-live="polite"
                        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    >
                        {establishments.map((establishment) => (
                            <EstablishmentCard
                                key={establishment.id}
                                establishment={establishment}
                            />
                        ))}
                    </div>

                    <div className="my-8 flex flex-col items-center justify-center">
                        {/* Afficher le bouton "Afficher plus" si on a plus de résultats à charger, pas en train de charger plus, pas d'erreur, et pas en train de charger initialement */}
                        {hasNextPage &&
                            !isFetchingNextPage &&
                            !isLoading &&
                            !error && (
                                <Button
                                    className="rounded-lg bg-violet-600 px-6 py-2.5 font-medium text-white hover:bg-violet-700"
                                    disabled={isFetchingNextPage}
                                    onClick={loadMoreItems}
                                >
                                    Afficher plus
                                </Button>
                            )}
                        {isFetchingNextPage && (
                            <div className="flex items-center justify-center gap-2 text-slate-500">
                                <Loader2 className="size-5 animate-spin" />
                                <p>Chargement en cours...</p>
                            </div>
                        )}
                    </div>
                    {/* Afficher "Fin des résultats" seulement si plus rien à charger, pas en cours de chargement, pas d'erreur, et il y a au moins un résultat */}
                    {!hasNextPage &&
                        !isFetchingNextPage &&
                        !isLoading &&
                        !error &&
                        establishments.length > 0 && (
                            <div className="mt-8 rounded-lg bg-slate-50 p-4 text-center text-slate-500">
                                <p className="font-medium">Fin des résultats</p>
                            </div>
                        )}
                </>
            )}
        </div>
    );
}
<Search className="size-8 text-slate-400" />;
