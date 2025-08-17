import { cookies } from "next/headers";

import { getInjection } from "@/di/container";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/presentation/components/ui/pagination";

interface EstablishmentsPaginationProps {
    // Next.js 15 passes searchParams as a Promise; support both sync and async
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

async function getPaginationData(
    searchParams:
        | Record<string, string | string[] | undefined>
        | Promise<Record<string, string | string[] | undefined>>
) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const filterEstablishmentsController = getInjection(
        "IFilterEstablishmentsController"
    );

    const resolvedSearchParams = await searchParams;
    const rawPage = resolvedSearchParams?.page;
    const page = Array.isArray(rawPage)
        ? Number.parseInt(rawPage[0] || "1", 10)
        : rawPage
          ? Number.parseInt(rawPage, 10)
          : 1;
    const perPage = 12;

    try {
        const cityIds = parseIdsFromParam(resolvedSearchParams?.cities);
        const domainIds = parseIdsFromParam(resolvedSearchParams?.domains);
        const levelIds = parseIdsFromParam(resolvedSearchParams?.levels);
        const establishmentTypeIds = parseIdsFromParam(
            resolvedSearchParams?.establishmentTypes
        );
        const legalStatuses = parseStringsFromParam(
            resolvedSearchParams?.legalStatuses
        );
        const nameContains = Array.isArray(resolvedSearchParams?.search)
            ? resolvedSearchParams?.search[0]
            : resolvedSearchParams?.search;

        const result = await filterEstablishmentsController(accessToken, {
            params: {
                perPage,
                page,
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
                    legalStatuses && legalStatuses.length
                        ? legalStatuses
                        : null,
                nameContains: nameContains || null,
            },
        });

        const totalItems = result?.totalItems || 0;
        const totalPages = Math.ceil(totalItems / perPage);

        return {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: perPage,
        };
    } catch (error) {
        console.error("Error fetching pagination data:", error);
        return {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 12,
        };
    }
}

function buildSearchParams(
    searchParams: Record<string, string | string[] | undefined> = {},
    page: number
): string {
    const params = new URLSearchParams();

    // Add all existing search params except page
    Object.entries(searchParams).forEach(([key, value]) => {
        if (key === "page" || value == null) return;
        if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
        } else if (value) {
            params.set(key, value);
        }
    });

    // Add the new page
    if (page > 1) {
        params.set("page", page.toString());
    }

    const paramString = params.toString();
    return paramString ? `?${paramString}` : "";
}

function generatePageNumbers(
    currentPage: number,
    totalPages: number
): (number | "ellipsis")[] {
    const pages: (number | "ellipsis")[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
        // Show all pages if 7 or fewer
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        // Always show first page
        pages.push(1);

        if (currentPage <= 4) {
            // Show pages 2, 3, 4, 5, ellipsis, last
            for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
                pages.push(i);
            }
            if (totalPages > 5) {
                pages.push("ellipsis");
            }
        } else if (currentPage >= totalPages - 3) {
            // Show 1, ellipsis, last-4, last-3, last-2, last-1, last
            pages.push("ellipsis");
            for (
                let i = Math.max(2, totalPages - 4);
                i <= totalPages - 1;
                i++
            ) {
                pages.push(i);
            }
        } else {
            // Show 1, ellipsis, current-1, current, current+1, ellipsis, last
            pages.push("ellipsis");
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pages.push(i);
            }
            pages.push("ellipsis");
        }

        // Always show last page (if not already included)
        if (totalPages > 1 && !pages.includes(totalPages)) {
            pages.push(totalPages);
        }
    }

    return pages;
}

export async function EstablishmentsPagination({
    searchParams = {},
}: EstablishmentsPaginationProps) {
    const { currentPage, totalPages, totalItems, itemsPerPage } =
        await getPaginationData(searchParams);
    if (totalItems === 0 || totalPages <= 1) return null;

    // Await works for both Promise and non-Promise values
    const resolvedSearchParams = await searchParams;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    const pageNumbers = generatePageNumbers(currentPage, totalPages);

    return (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            {/* Results info */}
            <div className="text-muted-foreground text-sm">
                Affichage de {startItem} à {endItem} sur {totalItems} résultats
            </div>

            {/* Pagination controls */}
            <Pagination>
                <PaginationContent>
                    {/* Previous button */}
                    <PaginationItem>
                        {currentPage > 1 ? (
                            <PaginationPrevious
                                href={`/establishments${buildSearchParams(resolvedSearchParams, currentPage - 1)}`}
                                size="default"
                            />
                        ) : (
                            <PaginationPrevious
                                href="#"
                                className="pointer-events-none opacity-50"
                                size="default"
                            />
                        )}
                    </PaginationItem>

                    {/* Page numbers */}
                    {pageNumbers.map((pageNum, index) => (
                        <PaginationItem key={index}>
                            {pageNum === "ellipsis" ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    href={`/establishments${buildSearchParams(resolvedSearchParams, pageNum)}`}
                                    isActive={pageNum === currentPage}
                                    size="default"
                                >
                                    {pageNum}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    {/* Next button */}
                    <PaginationItem>
                        {currentPage < totalPages ? (
                            <PaginationNext
                                href={`/establishments${buildSearchParams(resolvedSearchParams, currentPage + 1)}`}
                                size="default"
                            />
                        ) : (
                            <PaginationNext
                                href="#"
                                className="pointer-events-none opacity-50"
                                size="default"
                            />
                        )}
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
