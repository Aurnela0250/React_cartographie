"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Checkbox } from "@/presentation/components/ui/checkbox";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "@/presentation/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/presentation/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/presentation/components/ui/tabs";

interface SearchFiltersProps {
    compact?: boolean;
    onFilterChange?: (filters: FilterParams) => void;
}

interface Region {
    id: number;
    name: string;
}

interface EstablishmentType {
    id: number;
    name: string;
}

export interface FilterParams {
    name?: string;
    acronyme?: string;
    establishment_type_id?: number;
    city_id?: number;
    region_id?: number;
}

export function SearchFilters({
    compact = false,
    onFilterChange,
}: SearchFiltersProps) {
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [establishmentTypes, setEstablishmentTypes] = useState<
        EstablishmentType[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>("location");
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    // État pour stocker les filtres actuels
    const [filters, setFilters] = useState<FilterParams>({});
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Récupérer les régions
                const regionsResponse = await fetch(
                    "/api/regions?page=1&per_page=50"
                );
                const regionsData = await regionsResponse.json();

                // Récupérer les types d'établissement
                const typesResponse = await fetch(
                    "/api/establishment-types?page=1&per_page=50"
                );
                const typesData = await typesResponse.json();

                setRegions(regionsData.items || []);
                setEstablishmentTypes(typesData.items || []);
            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const addFilter = (filter: string) => {
        if (!activeFilters.includes(filter)) {
            setActiveFilters([...activeFilters, filter]);
        }
    };

    const removeFilter = (filter: string) => {
        setActiveFilters(activeFilters.filter((f) => f !== filter));
    };

    const clearFilters = () => {
        setActiveFilters([]);
        setFilters({});
        setSearchTerm("");
        if (onFilterChange) {
            onFilterChange({});
        }
    };

    const handleSearch = () => {
        // Mettre à jour les filtres avec le terme de recherche
        const updatedFilters = {
            ...filters,
            name: searchTerm || undefined,
        };

        setFilters(updatedFilters);

        if (onFilterChange) {
            onFilterChange(updatedFilters);
        }
    };

    const handleRegionChange = (value: string) => {
        const regionId = parseInt(value);
        const region = regions.find((r) => r.id === regionId);

        if (region) {
            addFilter(`Région: ${region.name}`);
            const updatedFilters = {
                ...filters,
                region_id: regionId,
            };

            setFilters(updatedFilters);

            if (onFilterChange) {
                onFilterChange(updatedFilters);
            }
        }
    };

    const handleTypeChange = (value: string) => {
        const typeId = parseInt(value);
        const type = establishmentTypes.find((t) => t.id === typeId);

        if (type) {
            addFilter(`Type: ${type.name}`);
            const updatedFilters = {
                ...filters,
                establishment_type_id: typeId,
            };

            setFilters(updatedFilters);

            if (onFilterChange) {
                onFilterChange(updatedFilters);
            }
        }
    };

    const handleApplyFilters = () => {
        if (onFilterChange) {
            onFilterChange(filters);
        }
        setIsPopoverOpen(false);
    };

    if (compact) {
        return (
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        className="h-9 pl-8 text-sm"
                        placeholder="Nom de l'établissement"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>

                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            aria-label="Filtres avancés"
                            className="h-9 px-3 text-sm"
                            variant="outline"
                        >
                            Filtres
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[300px] p-3">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h4 className="font-medium">Filtres avancés</h4>
                            <PopoverClose asChild>
                                <Button
                                    className="size-7"
                                    size="icon"
                                    variant="ghost"
                                >
                                    <X className="size-3" />
                                </Button>
                            </PopoverClose>
                        </div>

                        <div className="mt-3 space-y-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Région</Label>
                                <Select onValueChange={handleRegionChange}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Sélectionner une région" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loading ? (
                                            <SelectItem
                                                disabled
                                                value="loading"
                                            >
                                                Chargement...
                                            </SelectItem>
                                        ) : (
                                            regions.map((region) => (
                                                <SelectItem
                                                    key={region.id}
                                                    value={region.id.toString()}
                                                >
                                                    {region.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">
                                    Type d'établissement
                                </Label>
                                <Select onValueChange={handleTypeChange}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Sélectionner un type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loading ? (
                                            <SelectItem
                                                disabled
                                                value="loading"
                                            >
                                                Chargement...
                                            </SelectItem>
                                        ) : (
                                            establishmentTypes.map((type) => (
                                                <SelectItem
                                                    key={type.id}
                                                    value={type.id.toString()}
                                                >
                                                    {type.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Filtres actifs */}
                        {activeFilters.length > 0 && (
                            <div className="mt-3 space-y-2">
                                <Label className="text-xs">
                                    Filtres actifs
                                </Label>
                                <div className="flex flex-wrap gap-1">
                                    {activeFilters.map((filter) => (
                                        <Badge
                                            key={filter}
                                            className="text-xs"
                                            variant="secondary"
                                        >
                                            {filter}
                                            <button
                                                className="ml-1 rounded-full outline-none hover:text-destructive"
                                                onClick={() =>
                                                    removeFilter(filter)
                                                }
                                            >
                                                <X className="size-3" />
                                                <span className="sr-only">
                                                    Supprimer {filter}
                                                </span>
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-4 flex gap-2">
                            <Button
                                className="flex-1 text-xs"
                                size="sm"
                                variant="outline"
                                onClick={clearFilters}
                            >
                                Réinitialiser
                            </Button>
                            <Button
                                className="flex-1 text-xs"
                                size="sm"
                                onClick={handleApplyFilters}
                            >
                                Appliquer
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                <Button
                    aria-label="Rechercher"
                    className="size-9"
                    size="icon"
                    onClick={handleSearch}
                >
                    <Search className="size-4" />
                </Button>
            </div>
        );
    }

    // Version non compacte (garde la même structure pour la compatibilité)
    return (
        <div className="space-y-4 px-1">
            {/* Barre de recherche */}
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                    className="pl-8"
                    placeholder="Rechercher un établissement..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
            </div>

            {/* Onglets de filtres organisés */}
            <Tabs
                className="w-full"
                defaultValue="location"
                value={activeTab}
                onValueChange={setActiveTab}
            >
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="location">Localisation</TabsTrigger>
                    <TabsTrigger value="type">Type</TabsTrigger>
                    <TabsTrigger value="formation">Formation</TabsTrigger>
                </TabsList>

                <TabsContent className="mt-4 space-y-4" value="location">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label className="mb-1 block text-sm">Région</Label>
                            <Select onValueChange={handleRegionChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Toutes les régions" />
                                </SelectTrigger>
                                <SelectContent>
                                    {loading ? (
                                        <SelectItem disabled value="loading">
                                            Chargement...
                                        </SelectItem>
                                    ) : (
                                        regions.map((region) => (
                                            <SelectItem
                                                key={region.id}
                                                value={region.id.toString()}
                                            >
                                                {region.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="mb-1 block text-sm">Ville</Label>
                            <Select disabled>
                                <SelectTrigger>
                                    <SelectValue placeholder="Toutes les villes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="antananarivo">
                                        Antananarivo
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent className="mt-4" value="type">
                    <div className="max-h-[200px] overflow-y-auto rounded-md border p-2">
                        {loading ? (
                            <div className="p-2 text-center text-sm text-muted-foreground">
                                Chargement des types d'établissement...
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {establishmentTypes.map((type) => (
                                    <div
                                        key={type.id}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={`type-${type.id}`}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    addFilter(
                                                        `Type: ${type.name}`
                                                    );
                                                    const updatedFilters = {
                                                        ...filters,
                                                        establishment_type_id:
                                                            type.id,
                                                    };

                                                    setFilters(updatedFilters);
                                                    if (onFilterChange) {
                                                        onFilterChange(
                                                            updatedFilters
                                                        );
                                                    }
                                                } else {
                                                    removeFilter(
                                                        `Type: ${type.name}`
                                                    );
                                                    const {
                                                        establishment_type_id,
                                                        ...rest
                                                    } = filters;

                                                    setFilters(rest);
                                                    if (onFilterChange) {
                                                        onFilterChange(rest);
                                                    }
                                                }
                                            }}
                                        />
                                        <Label
                                            className="text-sm"
                                            htmlFor={`type-${type.id}`}
                                        >
                                            {type.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent className="mt-4 space-y-4" value="formation">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label className="mb-1 block text-sm">
                                Domaine d'études
                            </Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tous les domaines" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Informatique">
                                        Informatique
                                    </SelectItem>
                                    <SelectItem value="Médecine">
                                        Médecine
                                    </SelectItem>
                                    <SelectItem value="Droit">Droit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="mb-1 block text-sm">Niveau</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tous les niveaux" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Bac+1">Bac+1</SelectItem>
                                    <SelectItem value="Bac+2">Bac+2</SelectItem>
                                    <SelectItem value="Bac+3">Bac+3</SelectItem>
                                    <SelectItem value="Bac+5">Bac+5</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Filtres actifs */}
            {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 rounded-md bg-muted/30 p-2">
                    {activeFilters.map((filter) => (
                        <Badge
                            key={filter}
                            className="gap-1"
                            variant="secondary"
                        >
                            {filter}
                            <button
                                className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-1"
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
                        className="h-6 px-2 text-xs"
                        size="sm"
                        variant="ghost"
                        onClick={clearFilters}
                    >
                        Effacer tout
                    </Button>
                </div>
            )}

            <div className="flex gap-2">
                <Button
                    className="w-full"
                    size="sm"
                    variant="outline"
                    onClick={clearFilters}
                >
                    Réinitialiser
                </Button>
                <Button className="w-full" size="sm" onClick={handleSearch}>
                    Appliquer les filtres
                </Button>
            </div>
        </div>
    );
}
