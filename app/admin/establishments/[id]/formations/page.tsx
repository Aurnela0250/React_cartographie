import React, { Suspense } from "react";
import { cookies } from "next/headers";

import { Establishment } from "@/core/entities/establishment.entity";
import { EstablishmentApiRepository } from "@/infrastructure/repositories/establishment.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

import { FormationAddButton } from "./components/formation-add-button";
import { FormationAuthorizationDialog } from "./components/formation-authorization-dialog";
import { FormationsDeleteDialog } from "./components/formation-delete-dialog";
import { FormationsDialog } from "./components/formation-dialog";
import { FormationsList } from "./components/formation-list";
import { FormationListSkeleton } from "./components/formation-list-skeleton";

type FormationsPageProps = {
    params: {
        id: string;
    };
};

export default async function FormationsPage({ params }: FormationsPageProps) {
    const { id } = await params;
    const { accessToken } = await getAuthTokens();
    let establishment: Establishment | null = null;
    if (accessToken) {
        const repo = new EstablishmentApiRepository();
        try {
            establishment = await repo.get(accessToken, Number(id));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="container space-y-6 py-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    Formations de l'établissement :{" "}
                    {establishment?.name ?? "Inconnu"}
                </h1>
                <FormationAddButton />
            </div>
            <Suspense fallback={<FormationListSkeleton />}>
                <FormationsList establishmentId={id} />
            </Suspense>
            <FormationsDialog />
            <FormationsDeleteDialog />
            <FormationAuthorizationDialog />
        </div>
    );
}
