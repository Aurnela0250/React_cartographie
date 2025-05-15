"use client";

import { Establishment } from "@/core/entities/establishment.entity";
import { ILevel } from "@/core/entities/level.entity";
import { IMention } from "@/core/entities/mention.entity";
import { useQuery } from "@tanstack/react-query";

import { FormationsList } from "./FormationsList";

async function fetchEstablishmentById(id: string): Promise<Establishment> {
    if (!id) throw new Error("ID d'établissement non fourni");
    // Utilisation d'une URL relative, gérée par Next.js côté client
    const res = await fetch(`/api/establishments/${id}`);

    if (!res.ok) {
        const errorData = await res
            .json()
            .catch(() => ({ message: "Erreur inconnue" }));

        throw new Error(
            errorData.message ||
                "Erreur lors de la récupération de l'établissement"
        );
    }

    return res.json();
}

type EstablishmentDetailsClientProps = {
    establishmentId: string;
};

export function EstablishmentDetailsClient({
    establishmentId,
}: EstablishmentDetailsClientProps) {
    // Récupération de l'établissement
    const {
        data: establishment,
        isLoading,
        isError,
        error,
    } = useQuery<Establishment, Error>({
        queryKey: ["establishment", establishmentId],
        queryFn: () => fetchEstablishmentById(establishmentId),
        enabled: !!establishmentId,
    });

    // Récupération des niveaux
    const { data: levelsData } = useQuery<ILevel[]>({
        queryKey: ["levels", "all"],
        queryFn: async () => {
            const res = await fetch("/api/levels?page=1&per_page=100");
            const json = await res.json();

            return json.items || [];
        },
    });
    // Récupération des mentions
    const { data: mentionsData } = useQuery<IMention[]>({
        queryKey: ["mentions", "all"],
        queryFn: async () => {
            const res = await fetch("/api/mentions?page=1&per_page=100");
            const json = await res.json();

            return json.items || [];
        },
    });

    if (isLoading) {
        return (
            <div className="container py-6">
                Chargement de l'établissement...
            </div>
        );
    }
    if (isError) {
        return (
            <div className="container py-6 text-destructive">
                Erreur lors du chargement de l'établissement: {error?.message}
            </div>
        );
    }
    if (!establishment) {
        return <div className="container py-6">Établissement non trouvé.</div>;
    }

    // On filtre pour ne garder que les levels/mentions valides (id et name définis)
    const safeLevels = (levelsData || []).filter(
        (l): l is { id: number; name: string } =>
            typeof l.id === "number" && !!l.name
    );
    const safeMentions = (mentionsData || []).filter(
        (m): m is { id: number; name: string } =>
            typeof m.id === "number" && !!m.name
    );

    return (
        <div className="container py-6">
            <h1 className="mb-6 text-2xl font-bold">
                Formations de l'établissement : {establishment.name}
            </h1>
            <FormationsList
                establishmentId={establishment.id!}
                formations={establishment.formations || []}
                levels={safeLevels}
                mentions={safeMentions}
            />
        </div>
    );
}
