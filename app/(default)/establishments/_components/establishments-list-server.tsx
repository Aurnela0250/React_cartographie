import { Suspense } from "react";
import { cookies } from "next/headers";

import { getInjection } from "@/di/container";

import { EstablishmentCard } from "./establishment-card";
import { EstablishmentsEmptyState } from "./establishments-empty-state";
import { EstablishmentsErrorState } from "./establishments-error-state";
import { EstablishmentsListSkeleton } from "./establishments-list-skeleton";

interface EstablishmentsListServerProps {
    // Next.js 15 may pass a Promise; support both shapes
    searchParams?:
        | Record<string, string | string[] | undefined>
        | Promise<Record<string, string | string[] | undefined>>;
}

function parseStringsFromParam(
    param?: string | string[]
): string[] | undefined {
    if (!param) return undefined;
    const raw = Array.isArray(param) ? param.join(",") : param;
    if (!raw) return undefined;
    return raw
        .split(",")
        .map((entry) => entry.trim())
        .filter((s) => s.length > 0);
}

// Server-side data fetching function
function parseIdsFromParam(param?: string | string[]): number[] | undefined {
    if (!param) return undefined;
    const raw = Array.isArray(param) ? param.join(",") : param;
    if (!raw) return undefined;
    return raw
        .split(",")
        .map((entry) => entry.split(":")[0]!.trim())
        .map((id) => Number.parseInt(id, 10))
        .filter((n) => Number.isFinite(n));
}

async function getEstablishments(params: {
    page?: number;
    perPage?: number;
    cities?: string | string[];
    domains?: string | string[];
    levels?: string | string[];
    establishmentTypes?: string | string[];
    legalStatuses?: string | string[];
    search?: string | string[];
}) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const filterEstablishmentsController = getInjection(
        "IFilterEstablishmentsController"
    );

    const cityIds = parseIdsFromParam(params.cities);
    const domainIds = parseIdsFromParam(params.domains);
    const levelIds = parseIdsFromParam(params.levels);
    const establishmentTypeIds = parseIdsFromParam(params.establishmentTypes);
    const legalStatuses = parseStringsFromParam(params.legalStatuses);
    const nameContains = Array.isArray(params.search)
        ? params.search[0]
        : params.search;

    const result = await filterEstablishmentsController(accessToken, {
        params: {
            perPage: params.perPage || 12,
            page: params.page || 1,
        },
        filters: {
            cityIds: cityIds && cityIds.length ? cityIds : null,
            domainIds: domainIds && domainIds.length ? domainIds : null,
            levelIds: levelIds && levelIds.length ? levelIds : null,
            establishmentTypeIds:
                establishmentTypeIds && establishmentTypeIds.length
                    ? establishmentTypeIds
                    : null,
            legalStatuses:
                legalStatuses && legalStatuses.length ? legalStatuses : null,
            nameContains: nameContains || null,
        },
    });

    return result;
}

// Main establishments list component
async function EstablishmentsList({
    searchParams,
}: EstablishmentsListServerProps) {
    const resolvedSearchParams = await searchParams;
    const rawPage = resolvedSearchParams?.page;
    const page = Array.isArray(rawPage)
        ? Number.parseInt(rawPage[0] || "1", 10)
        : rawPage
          ? Number.parseInt(rawPage, 10)
          : 1;

    try {
        const result = await getEstablishments({
            page,
            perPage: 12,
            cities: resolvedSearchParams?.cities,
            domains: resolvedSearchParams?.domains,
            levels: resolvedSearchParams?.levels,
            establishmentTypes: resolvedSearchParams?.establishmentTypes,
            legalStatuses: resolvedSearchParams?.legalStatuses,
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
