"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Layers, Minus, Plus } from "lucide-react";
import { useMap } from "react-leaflet";

import type { Establishment } from "@/core/entities/establishment.entity";
import { env } from "@/env.mjs";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";

import { FilterParams } from "../search-filters";

const MapContainer = dynamic<
    React.ComponentProps<typeof import("react-leaflet").MapContainer>
>(() => import("react-leaflet").then((mod) => mod.MapContainer), {
    ssr: false,
});
const TileLayer = dynamic<
    React.ComponentProps<typeof import("react-leaflet").TileLayer>
>(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic<
    React.ComponentProps<typeof import("react-leaflet").Marker>
>(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic<
    React.ComponentProps<typeof import("react-leaflet").Popup>
>(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

if (typeof window !== "undefined") {
    import("leaflet").then((leaflet) => {
        if (leaflet && leaflet.Icon && leaflet.Icon.Default) {
            leaflet.Icon.Default.mergeOptions({
                iconRetinaUrl:
                    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl:
                    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl:
                    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });
        }
    });
}

interface MapExplorerProps {
    preview?: boolean;
    filters?: FilterParams;
}

export function MapExplorer(props: MapExplorerProps) {
    const { preview = false, filters } = props;
    // Pour éviter la recréation d'objet à chaque rendu
    const stableFilters = filters || {};
    const [establishments, setEstablishments] = useState<Establishment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEstablishment, setSelectedEstablishment] =
        useState<Establishment | null>(null);
    const [zoom, setZoom] = useState(13);
    const [center, setCenter] = useState<[number, number]>([
        -18.8792,
        47.5079, // Coordonnées par défaut pour Antananarivo
    ]);
    const [tileType, setTileType] = useState<
        "standard" | "satellite" | "terrain"
    >("standard");

    const MAPTILER_KEY =
        env.NEXT_PUBLIC_MAP_API_KEY || "get_your_own_D6rA4zTHduk6KOKTXzGB";

    // Fonction pour récupérer les établissements
    const fetchEstablishments = async () => {
        try {
            setLoading(true);

            // Construire les paramètres de requête
            const params = new URLSearchParams();

            params.append("page", "1");
            params.append("per_page", "50"); // Récupérer plus d'établissements pour la carte

            // Ajouter les filtres s'ils sont présents
            if (stableFilters.name) params.append("name", stableFilters.name);
            if (stableFilters.acronyme)
                params.append("acronyme", stableFilters.acronyme);
            if (stableFilters.establishmentTypeId)
                params.append(
                    "establishment_type_id",
                    stableFilters.establishmentTypeId.toString()
                );
            if (stableFilters.cityId)
                params.append("city_id", stableFilters.cityId.toString());
            if (stableFilters.regionId)
                params.append("region_id", stableFilters.regionId.toString());

            // Utiliser l'API de filtrage
            const response = await fetch(
                `/api/establishments/filter?${params.toString()}`
            );

            if (!response.ok) {
                throw new Error(
                    "Erreur lors de la récupération des établissements"
                );
            }

            const data = await response.json();
            const fetchedEstablishments = data.items || [];

            setEstablishments(fetchedEstablishments);

            // Si nous avons des établissements, centrer la carte sur le premier
            if (
                fetchedEstablishments.length > 0 &&
                fetchedEstablishments[0].latitude &&
                fetchedEstablishments[0].longitude
            ) {
                setCenter([
                    fetchedEstablishments[0].latitude,
                    fetchedEstablishments[0].longitude,
                ]);
            }
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setLoading(false);
        }
    };

    // Charger les établissements au chargement et quand les filtres changent
    useEffect(() => {
        fetchEstablishments();
    }, [stableFilters]);

    // Gestion du changement de fond de carte
    const getTileUrl = () => {
        switch (tileType) {
            case "satellite":
                return `https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=${MAPTILER_KEY}`;
            case "terrain":
                return `https://api.maptiler.com/maps/topo-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`;
            default:
                return `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`;
        }
    };

    // Centrage sur le marker sélectionné
    function FlyToMarker({ position }: { position: [number, number] }) {
        const map = useMap();

        useEffect(() => {
            if (position) {
                map.flyTo(position, zoom);
            }
        }, [position]);

        return null;
    }

    // Si chargement en cours, afficher un message
    if (loading && !preview) {
        return (
            <div className="flex h-full items-center justify-center">
                Chargement de la carte...
            </div>
        );
    }

    return (
        <div className="relative size-full overflow-hidden rounded-lg">
            <MapContainer
                scrollWheelZoom
                center={center}
                style={{ height: "100%", width: "100%" }}
                zoom={zoom}
            >
                <TileLayer url={getTileUrl()} />
                {establishments.map((establishment) => {
                    // Ne pas afficher les établissements sans coordonnées
                    if (!establishment.latitude || !establishment.longitude)
                        return null;

                    return (
                        <Marker
                            key={establishment.id}
                            eventHandlers={{
                                click: () => {
                                    setSelectedEstablishment(establishment);
                                    setCenter([
                                        establishment.latitude!,
                                        establishment.longitude!,
                                    ]);
                                },
                            }}
                            position={[
                                establishment.latitude,
                                establishment.longitude,
                            ]}
                        >
                            {selectedEstablishment?.id === establishment.id &&
                                !preview && (
                                    <Popup
                                        closeButton={false}
                                        maxWidth={350}
                                        minWidth={250}
                                    >
                                        <div className="mb-2 flex items-start justify-between">
                                            <h3 className="font-medium">
                                                {establishment.name}
                                            </h3>
                                            <Badge variant="outline">
                                                {establishment.establishmentType
                                                    ?.name || "Établissement"}
                                            </Badge>
                                        </div>
                                        <p className="mb-3 text-sm text-muted-foreground">
                                            {establishment.address ||
                                                "Adresse non disponible"}
                                        </p>
                                        <div className="mb-4 flex justify-between text-sm">
                                            <span>
                                                {establishment.formations
                                                    ?.length || 0}{" "}
                                                formations
                                            </span>
                                            <span>
                                                {establishment.rating
                                                    ? `Note: ${establishment.rating}/5`
                                                    : "Non noté"}
                                            </span>
                                        </div>
                                        <Button asChild className="w-full">
                                            <Link
                                                href={`/establishments/${establishment.id}`}
                                            >
                                                Voir les détails
                                            </Link>
                                        </Button>
                                    </Popup>
                                )}
                        </Marker>
                    );
                })}
                {selectedEstablishment &&
                    selectedEstablishment.latitude &&
                    selectedEstablishment.longitude && (
                        <FlyToMarker
                            position={[
                                selectedEstablishment.latitude,
                                selectedEstablishment.longitude,
                            ]}
                        />
                    )}
            </MapContainer>

            {/* Contrôles custom */}
            <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
                <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setZoom((z) => Math.min(z + 1, 18))}
                >
                    <Plus className="size-4" />
                </Button>
                <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setZoom((z) => Math.max(z - 1, 1))}
                >
                    <Minus className="size-4" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="secondary">
                            <Layers className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => setTileType("standard")}
                        >
                            Carte standard
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setTileType("satellite")}
                        >
                            Satellite
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setTileType("terrain")}
                        >
                            Terrain
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
