import { cookies } from "next/headers";

import { getInjection } from "@/di/container";
import { Separator } from "@/presentation/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/presentation/components/ui/sidebar";

import { EstablishmentsFilterSidebar } from "./_components/establishments-filter-sidebar";
import { EstablishmentsListServer } from "./_components/establishments-list-server";
import { EstablishmentsPagination } from "./_components/establishments-pagination";

interface EstablishmentsPageProps {
    searchParams?: {
        page?: string;
        cities?: string;
        domains?: string;
        levels?: string;
        search?: string;
    };
}

// Server-side function to get pagination data
async function getPaginationData(
    searchParams: EstablishmentsPageProps["searchParams"]
) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const filterEstablishmentsController = getInjection(
        "IFilterEstablishmentsController"
    );

    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams?.page
        ? parseInt(resolvedSearchParams.page)
        : 1;
    const perPage = 12;

    try {
        const result = await filterEstablishmentsController(accessToken, {
            params: {
                perPage,
                page,
                // Filter parameters will be implemented later
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
            itemsPerPage: perPage,
        };
    }
}

export default async function EstablishmentsPage({
    searchParams,
}: EstablishmentsPageProps) {
    const paginationData = await getPaginationData(searchParams);

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            {/* Sidebar for filters */}
            <EstablishmentsFilterSidebar
                className="top-20 z-40 h-[calc(100vh-5rem)]"
                variant="inset"
            />

            {/* Main content */}
            <SidebarInset>
                <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b py-8 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
                    <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <div className="flex flex-col">
                            <h1 className="text-lg font-semibold">
                                Établissements
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Découvrez tous les établissements d'enseignement
                                supérieur
                            </p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 space-y-6 p-6">
                    {/* Main establishments list */}
                    <EstablishmentsListServer searchParams={searchParams} />

                    {/* Pagination */}
                    <EstablishmentsPagination
                        currentPage={paginationData.currentPage}
                        totalPages={paginationData.totalPages}
                        totalItems={paginationData.totalItems}
                        itemsPerPage={paginationData.itemsPerPage}
                        searchParams={searchParams}
                    />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
