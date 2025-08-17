import { Separator } from "@/presentation/components/ui/separator";
import { SidebarTrigger } from "@/presentation/components/ui/sidebar";

import { EstablishmentsListServer } from "./_components/establishments-list-server";
import { EstablishmentsPagination } from "./_components/establishments-pagination";

interface EstablishmentsPageProps {
    searchParams?:
        | Record<string, string | string[] | undefined>
        | Promise<Record<string, string | string[] | undefined>>;
}

export default async function EstablishmentsPage({
    searchParams,
}: EstablishmentsPageProps) {
    return (
        <>
            <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b py-8 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
                <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
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
                <EstablishmentsPagination searchParams={searchParams} />
            </div>
        </>
    );
}
