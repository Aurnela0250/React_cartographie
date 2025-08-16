import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    searchParams?: {
        page?: string;
        cities?: string;
        domains?: string;
        levels?: string;
        search?: string;
    };
}

function buildSearchParams(searchParams: Record<string, string | undefined> = {}, page: number): string {
    const params = new URLSearchParams();
    
    // Add all existing search params except page
    Object.entries(searchParams).forEach(([key, value]) => {
        if (key !== 'page' && value) {
            params.set(key, value);
        }
    });
    
    // Add the new page
    if (page > 1) {
        params.set('page', page.toString());
    }
    
    const paramString = params.toString();
    return paramString ? `?${paramString}` : '';
}

function generatePageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
    const pages: (number | 'ellipsis')[] = [];
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
                pages.push('ellipsis');
            }
        } else if (currentPage >= totalPages - 3) {
            // Show 1, ellipsis, last-4, last-3, last-2, last-1, last
            pages.push('ellipsis');
            for (let i = Math.max(2, totalPages - 4); i <= totalPages - 1; i++) {
                pages.push(i);
            }
        } else {
            // Show 1, ellipsis, current-1, current, current+1, ellipsis, last
            pages.push('ellipsis');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pages.push(i);
            }
            pages.push('ellipsis');
        }
        
        // Always show last page (if not already included)
        if (totalPages > 1 && !pages.includes(totalPages)) {
            pages.push(totalPages);
        }
    }
    
    return pages;
}

export async function EstablishmentsPagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    searchParams = {},
}: EstablishmentsPaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const resolvedSearchParams = await searchParams;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    const pageNumbers = generatePageNumbers(currentPage, totalPages);

    return (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            {/* Results info */}
            <div className="text-sm text-muted-foreground">
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
                            {pageNum === 'ellipsis' ? (
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
