import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getInjection } from "@/di/container";
import {
    AuthenticationError,
    UnauthenticatedError,
} from "@/src/entities/errors/auth";

import { EstablishmentContact } from "./establishment-contact";
import { EstablishmentFormations } from "./establishment-formations";
import { EstablishmentHeaderCard } from "./establishment-header-card";
import { EstablishmentInfoSkeleton } from "./establishment-info-skeleton";

interface EstablishmentInfoProps {
    establishmentId: number;
}

// Server-side data fetching function
async function getEstablishment(id: number) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        const getEstablishmentController = getInjection(
            "IGetEstablishmentController"
        );

        const result = await getEstablishmentController(id, accessToken);
        return result;
    } catch (error) {
        if (
            error instanceof UnauthenticatedError ||
            error instanceof AuthenticationError
        ) {
            redirect("/sign-in");
        }
        throw error;
    }
}

// Main establishment info component
async function EstablishmentDetails({
    establishmentId,
}: EstablishmentInfoProps) {
    try {
        const establishment = await getEstablishment(establishmentId);

        return (
            <div className="space-y-6">
                {/* Header Card with Stats */}
                <EstablishmentHeaderCard establishment={establishment} />

                {/* Two-column layout */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Contact Information */}
                    <div className="lg:col-span-1">
                        <EstablishmentContact establishment={establishment} />
                    </div>

                    {/* Formations disponibles */}
                    <div className="lg:col-span-2">
                        <EstablishmentFormations
                            establishment={establishment}
                        />
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error fetching establishment:", error);
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <h2 className="mb-2 text-xl font-semibold text-gray-900">
                        Erreur lors du chargement
                    </h2>
                    <p className="text-muted-foreground">
                        Impossible de charger les informations de
                        l'établissement.
                    </p>
                </div>
            </div>
        );
    }
}

// Main exported component with Suspense
export function EstablishmentInfo({ establishmentId }: EstablishmentInfoProps) {
    return (
        <Suspense fallback={<EstablishmentInfoSkeleton />}>
            <EstablishmentDetails establishmentId={establishmentId} />
        </Suspense>
    );
}
