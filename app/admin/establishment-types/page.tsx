import React, { Suspense } from "react";

import { EstablishmentTypeAddButton } from "./components/establishment-type-add-button";
import { EstablishmentTypeDeleteDialog } from "./components/establishment-type-delete-dialog";
import { EstablishmentTypeDialog } from "./components/establishment-type-dialog";
import { EstablishmentTypeList } from "./components/establishment-type-list";
import { EstablishmentTypeListSkeleton } from "./components/establishment-type-list-skeleton";

export default function EstablishmentTypePage() {
    return (
        <div className="container space-y-6 py-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Types d'établissement</h1>
                <EstablishmentTypeAddButton />
            </div>
            <Suspense fallback={<EstablishmentTypeListSkeleton />}>
                <EstablishmentTypeList />
            </Suspense>
            <EstablishmentTypeDialog />
            <EstablishmentTypeDeleteDialog />
        </div>
    );
}
