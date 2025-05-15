"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, MapPin, Search, Star, Users, X } from "lucide-react";

import { Establishment } from "@/core/entities/establishment.entity";
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

export function FeaturedEstablishments() {
    const [establishments, setEstablishments] = useState<Establishment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterParams>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    useEffect(() => {
        async function fetchEstablishments() {
            try {
                setLoading(true);

                // Construire les paramètres de requête
                const params = new URLSearchParams();

                params.append("page", "1");
                params.append("perPage", "3");

                // Ajouter les filtres s'ils sont présents
                if (filters.name) params.append("name", filters.name);
                if (filters.acronyme)
                    params.append("acronyme", filters.acronyme);
                if (filters.establishmentTypeId)
                    params.append(
                        "establishment_type_id",
                        filters.establishmentTypeId.toString()
                    );
                if (filters.cityId)
                    params.append("city_id", filters.cityId.toString());
                if (filters.regionId)
                    params.append("region_id", filters.regionId.toString());

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

                setEstablishments(data.items || []);
            } catch (error) {
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchEstablishments();
    }, [filters]);

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
            delete updatedFilters.regionId;
        } else if (type === "Type") {
            delete updatedFilters.establishmentTypeId;
        }

        setFilters(updatedFilters);
        setActiveFilters(activeFilters.filter((f) => f !== filter));
    };

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Établissements à la une</h2>
                <Button asChild variant="ghost">
                    <Link href="/establishments">Voir tous</Link>
                </Button>
            </div>

            {/* Nouveau design moderne pour les filtres */}
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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    // Afficher des skeletons pendant le chargement
                    Array.from({ length: 3 }).map((_, index) => (
                        <Card
                            key={`skeleton-${index}`}
                            className="overflow-hidden"
                        >
                            <Skeleton className="h-40 w-full" />
                            <CardContent className="p-4">
                                <div className="mb-2 flex items-start justify-between">
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-5 w-10" />
                                </div>
                                <Skeleton className="mb-1 h-6 w-3/4" />
                                <Skeleton className="mb-2 h-4 w-2/3" />
                                <Skeleton className="mb-4 h-4 w-1/2" />
                                <Skeleton className="h-9 w-full" />
                            </CardContent>
                        </Card>
                    ))
                ) : establishments.length > 0 ? (
                    establishments.map((establishment) => (
                        <Card
                            key={establishment.id}
                            className="overflow-hidden"
                        >
                            <div className="relative h-40 w-full">
                                <Image
                                    fill
                                    alt={"Établissement"}
                                    className="object-cover"
                                    // height={300}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    src="https://www.google.com/imgres?q=mesupres&imgurl=https%3A%2F%2Fwww.pseau.org%2Fgif%2Flogo_mesupres_mg.jpg&imgrefurl=https%3A%2F%2Fwww.pseau.org%2Foutils%2Fexperts-scientifiques%2Fexpert_resultat.php%3Fcont_contact_id%5B%5D%3D123723%26l%3Dfr%26tout%3D1&docid=x5V2PxRtxItgTM&tbnid=fe6EDUlQZF_V7M&vet=12ahUKEwj2_b-Ck5WNAxWQXkEAHcxQIwcQM3oECGIQAA..i&w=504&h=326&hcb=2&ved=2ahUKEwj2_b-Ck5WNAxWQXkEAHcxQIwcQM3oECGIQAA"
                                    // width={768}
                                />
                            </div>
                            <CardContent className="p-4">
                                <div className="mb-2 flex items-start justify-between">
                                    <Badge variant="outline">
                                        {establishment.establishment_type
                                            ?.name || "Établissement"}
                                    </Badge>
                                    <div className="flex items-center gap-1">
                                        <Star className="size-4 fill-yellow-500 text-yellow-500" />
                                        <span className="text-sm font-medium">
                                            {establishment.rating || "N/A"}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="mb-1 line-clamp-2 text-lg font-semibold">
                                    {establishment.name}
                                    {establishment.acronyme
                                        ? ` (${establishment.acronyme})`
                                        : ""}
                                </h3>

                                <div className="mb-2 flex items-center text-muted-foreground">
                                    <MapPin className="mr-1 size-3" />
                                    <span className="line-clamp-1 text-sm">
                                        {establishment.address ||
                                            "Adresse non disponible"}
                                    </span>
                                </div>

                                <div className="mb-4 flex items-center text-muted-foreground">
                                    <Users className="mr-1 size-3" />
                                    <span className="text-sm">
                                        {establishment.formations?.length || 0}{" "}
                                        formations
                                    </span>
                                </div>

                                <Button asChild className="w-full">
                                    <Link
                                        href={`/establishments/${establishment.id}`}
                                    >
                                        Découvrir
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-3 py-8 text-center">
                        <p className="text-muted-foreground">
                            Aucun établissement trouvé
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
