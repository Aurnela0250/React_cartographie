import { Suspense } from "react";
import { cookies } from "next/headers";

import { getInjection } from "@/di/container";

import { EstablishmentCard } from "./establishment-card";
import { EstablishmentsEmptyState } from "./establishments-empty-state";
import { EstablishmentsErrorState } from "./establishments-error-state";
import { EstablishmentsListSkeleton } from "./establishments-list-skeleton";

interface EstablishmentsListServerProps {
    searchParams?: {
        page?: string;
        cities?: string;
        domains?: string;
        levels?: string;
        search?: string;
    };
}

// Server-side data fetching function
async function getEstablishments(params: {
    page?: number;
    perPage?: number;
    cities?: string;
    domains?: string;
    levels?: string;
    search?: string;
}) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const filterEstablishmentsController = getInjection(
        "IFilterEstablishmentsController"
    );

    const result = await filterEstablishmentsController(accessToken, {
        params: {
            perPage: params.perPage || 12,
            page: params.page || 1,
            // Filter parameters will be implemented later
        },
    });

    return result;
}

// Main establishments list component
async function EstablishmentsList({
    searchParams,
}: EstablishmentsListServerProps) {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams?.page
        ? parseInt(resolvedSearchParams.page)
        : 1;

    try {
        const result = await getEstablishments({
            page,
            perPage: 12,
            cities: resolvedSearchParams?.cities,
            domains: resolvedSearchParams?.domains,
            levels: resolvedSearchParams?.levels,
            search: resolvedSearchParams?.search,
        });

        const establishments = result?.items || [];
        const totalCount = result?.totalItems || 0;

        if (establishments.length === 0) {
            return <EstablishmentsEmptyState />;
        }

        return (
            <div className="space-y-6">
                {/* Results header */}
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">
                        {totalCount} établissement{totalCount > 1 ? "s" : ""}{" "}
                        trouvé{totalCount > 1 ? "s" : ""}
                    </p>
                    <p className="text-muted-foreground text-sm">Page {page}</p>
                </div>

                {/* Establishments grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    {establishments.map((establishment: any) => (
                        <EstablishmentCard
                            key={establishment.id}
                            establishment={establishment}
                        />
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error fetching establishments:", error);
        return <EstablishmentsErrorState />;
    }
}

// Main exported component with Suspense
export function EstablishmentsListServer({
    searchParams,
}: EstablishmentsListServerProps) {
    return (
        <Suspense fallback={<EstablishmentsListSkeleton />}>
            <EstablishmentsList searchParams={searchParams} />
        </Suspense>
    );
}
