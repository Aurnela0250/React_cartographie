"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Filter, MapPin, Search, Star, X } from "lucide-react";

import { Establishment } from "@/core/domain/entities/establishment.entity";
import {
    FilterParams,
    SearchFilters,
} from "@/presentation/components/features/search-filters";
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
import { Skeleton } from "@/presentation/components/ui/skeleton";

export function EstablishmentList() {
    const [establishments, setEstablishments] = useState<Establishment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterParams>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastEstablishmentRef = useRef<HTMLDivElement | null>(null);

    const fetchEstablishments = async (
        currentPage: number,
        resetList: boolean = false
    ) => {
        try {
            setLoading(true);
            setError(null);

            // Construire les paramètres de requête
            const params = new URLSearchParams();

            params.append("page", currentPage.toString());
            params.append("per_page", "12"); // Augmenter la taille pour la grille

            // Ajouter les filtres s'ils sont présents
            if (filters.name) params.append("name", filters.name);
            if (filters.acronyme) params.append("acronyme", filters.acronyme);
            if (filters.establishment_type_id)
                params.append(
                    "establishment_type_id",
                    filters.establishment_type_id.toString()
                );
            if (filters.city_id)
                params.append("city_id", filters.city_id.toString());
            if (filters.region_id)
                params.append("region_id", filters.region_id.toString());

            // Utiliser l'API de filtrage avec les paramètres
            const response = await fetch(
                `/api/establishments/filter?${params.toString()}`
            );

            if (!response.ok) {
                throw new Error(
                    "Erreur lors de la récupération des établissements"
                );
            }

            const data = await response.json();
            const newEstablishments = data.items || [];

            // Mettre à jour la liste des établissements
            setEstablishments((prev) =>
                resetList ? newEstablishments : [...prev, ...newEstablishments]
            );

            // Vérifier s'il y a plus de résultats
            setHasMore(data.meta?.current_page < data.meta?.last_page);
        } catch (error) {
            console.error("Erreur:", error);
            setError(
                "Une erreur est survenue lors du chargement des établissements"
            );
        } finally {
            setLoading(false);
        }
    };

    // Effet pour charger les établissements initiaux
    useEffect(() => {
        fetchEstablishments(1, true);
        setPage(1);
    }, [filters]);

    // Configuration de l'intersection observer pour le défilement infini
    useEffect(() => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => {
                        const nextPage = prevPage + 1;

                        fetchEstablishments(nextPage, false);

                        return nextPage;
                    });
                }
            },
            { threshold: 0.5 }
        );

        if (lastEstablishmentRef.current) {
            observer.current.observe(lastEstablishmentRef.current);
        }

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [loading, hasMore]);

    const handleFilterChange = (newFilters: FilterParams) => {
        setFilters(newFilters);

        // Mettre à jour les badges de filtres actifs
        const badges: string[] = [];

        if (newFilters.name) badges.push(`Nom: ${newFilters.name}`);
        if (newFilters.region_id) {
            const regionId = newFilters.region_id;

            badges.push(`Région: ${regionId}`);
        }
        if (newFilters.establishment_type_id) {
            const typeId = newFilters.establishment_type_id;

            badges.push(`Type: ${typeId}`);
        }
        setActiveFilters(badges);

        // Fermer le popover après application des filtres
        setIsFilterOpen(false);
    };

    const handleSearch = () => {
        setFilters((prev) => ({
            ...prev,
            name: searchTerm || undefined,
        }));
    };

    const clearFilters = () => {
        setFilters({});
        setSearchTerm("");
        setActiveFilters([]);
    };

    const removeFilter = (filter: string) => {
        const type = filter.split(":")[0].trim();
        const updatedFilters = { ...filters };

        if (type === "Nom") {
            delete updatedFilters.name;
            setSearchTerm("");
        } else if (type === "Région") {
            delete updatedFilters.region_id;
        } else if (type === "Type") {
            delete updatedFilters.establishment_type_id;
        }

        setFilters(updatedFilters);
        setActiveFilters(activeFilters.filter((f) => f !== filter));
    };

    // Rendu des skeletons pour la grille
    const renderGridSkeletons = (count: number = 6) => {
        return Array.from({ length: count }).map((_, index) => (
            <Card key={`grid-skeleton-${index}`} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardContent className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-10" />
                    </div>
                    <Skeleton className="mb-1 h-6 w-3/4" />
                    <Skeleton className="mb-2 h-4 w-2/3" />
                    <Skeleton className="mb-4 h-4 w-1/2" />
                    <div className="flex gap-2">
                        <Skeleton className="h-9 flex-1" />
                        <Skeleton className="h-9 flex-1" />
                    </div>
                </CardContent>
            </Card>
        ));
    };

    return (
        <div className="space-y-6">
            {/* Section de filtres avec design moderne */}
            <div className="flex flex-wrap gap-3">
                <div className="relative grow basis-64">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        className="h-10 pl-10 pr-4"
                        placeholder="Rechercher un établissement..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        className="h-10"
                        variant="default"
                        onClick={handleSearch}
                    >
                        <Search className="mr-2 size-4" />
                        Rechercher
                    </Button>

                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <PopoverTrigger asChild>
                            <Button className="h-10" variant="outline">
                                <Filter className="mr-2 size-4" />
                                Filtres
                                {activeFilters.length > 0 && (
                                    <span className="ml-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                        {activeFilters.length}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            align="end"
                            className="w-80 p-0"
                            sideOffset={8}
                        >
                            <div className="p-4 pb-0">
                                <div className="mb-4 flex items-center justify-between border-b pb-2">
                                    <h3 className="font-medium">
                                        Filtres avancés
                                    </h3>
                                    <PopoverClose asChild>
                                        <Button
                                            className="size-7"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <X className="size-3.5" />
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

                {/* Badges de filtres actifs */}
                {activeFilters.length > 0 && (
                    <div className="mt-2 flex w-full flex-wrap gap-1.5">
                        {activeFilters.map((filter) => (
                            <Badge
                                key={filter}
                                className="rounded-md bg-secondary/80 px-2 py-1 text-xs font-normal"
                                variant="secondary"
                            >
                                {filter}
                                <button
                                    className="ml-1.5 rounded-full hover:text-destructive focus:outline-none"
                                    onClick={() => removeFilter(filter)}
                                >
                                    <X className="size-3" />
                                    <span className="sr-only">
                                        Supprimer {filter}
                                    </span>
                                </button>
                            </Badge>
                        ))}
                        <Button
                            className="h-6 rounded-md px-2 text-xs font-normal"
                            size="sm"
                            variant="ghost"
                            onClick={clearFilters}
                        >
                            Effacer tout
                        </Button>
                    </div>
                )}
            </div>

            {/* Message d'erreur */}
            {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-center text-destructive">
                    {error}
                </div>
            )}

            {/* Message pour aucun résultat */}
            {establishments.length === 0 && !loading ? (
                <div className="rounded-md bg-muted/50 p-8 text-center">
                    <p className="text-muted-foreground">
                        Aucun établissement trouvé avec les critères de
                        recherche actuels.
                    </p>
                    <Button
                        className="mt-4"
                        variant="outline"
                        onClick={clearFilters}
                    >
                        Réinitialiser les filtres
                    </Button>
                </div>
            ) : (
                <>
                    {/* Grille d'établissements */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {establishments.map((establishment, index) => {
                            const isLastItem =
                                index === establishments.length - 1;

                            return (
                                <Card
                                    key={establishment.id}
                                    ref={
                                        isLastItem ? lastEstablishmentRef : null
                                    }
                                    className="overflow-hidden transition-shadow hover:shadow-md"
                                >
                                    <div className="relative h-40 w-full">
                                        <Image
                                            fill
                                            alt={"Établissement"}
                                            className="object-cover"
                                            // priority={index < 4}
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            src="https://www.google.com/imgres?q=mesupres&imgurl=https%3A%2F%2Fpta-mesupres.cloud%2Fassets%2Fimages%2Flogo%2FMESUPRES.png&imgrefurl=https%3A%2F%2Fpta-mesupres.cloud%2F&docid=sQpMGkdrPuaFnM&tbnid=rmtKWA54mKBz6M&vet=12ahUKEwj2_b-Ck5WNAxWQXkEAHcxQIwcQM3oECH8QAA..i&w=1080&h=1080&hcb=2&ved=2ahUKEwj2_b-Ck5WNAxWQXkEAHcxQIwcQM3oECH8QAA"
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="mb-2 flex items-start justify-between">
                                            <Badge variant="outline">
                                                {establishment
                                                    .establishment_type?.name ||
                                                    "Établissement"}
                                            </Badge>
                                            <div className="flex items-center gap-1">
                                                <Star className="size-4 fill-yellow-500 text-yellow-500" />
                                                <span className="text-sm font-medium">
                                                    {establishment.rating ||
                                                        "N/A"}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="mb-1 line-clamp-2 text-lg font-semibold">
                                            {establishment.name}
                                            {establishment.acronyme && (
                                                <span className="text-muted-foreground">
                                                    {" "}
                                                    ({establishment.acronyme})
                                                </span>
                                            )}
                                        </h3>

                                        <div className="mb-2 flex items-center text-muted-foreground">
                                            <MapPin className="mr-1 size-3" />
                                            <span className="line-clamp-1 text-sm">
                                                {establishment.address ||
                                                    "Adresse non disponible"}
                                            </span>
                                        </div>

                                        <div className="mb-4 flex items-center text-muted-foreground">
                                            <BookOpen className="mr-1 size-3" />
                                            <span className="text-sm">
                                                {establishment.formations
                                                    ?.length || 0}{" "}
                                                formations
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                asChild
                                                className="flex-1"
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Link
                                                    href={`/map?id=${establishment.id}`}
                                                >
                                                    Carte
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                className="flex-1"
                                                size="sm"
                                            >
                                                <Link
                                                    href={`/establishments/${establishment.id}`}
                                                >
                                                    Détails
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        {/* Skeletons de chargement */}
                        {loading && renderGridSkeletons(6)}
                    </div>

                    {/* Message de fin des résultats */}
                    {!hasMore && establishments.length > 0 && !loading && (
                        <div className="py-4 text-center text-muted-foreground">
                            Fin des résultats
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
