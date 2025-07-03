// Page principale pour la gestion des établissements (squelette, à compléter)
import React, { Suspense } from "react";

import { EstablishmentAddButton } from "./components/establishment-add-button";
import { EstablishmentDeleteDialog } from "./components/establishment-delete-dialog";
import { EstablishmentDialog } from "./components/establishment-dialog";
import { EstablishmentList } from "./components/establishment-list";
import { EstablishmentListSkeleton } from "./components/establishment-list-skeleton";

export default function EstablishmentPage() {
    return (
        <div className="container space-y-6 py-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Établissements</h1>
                <EstablishmentAddButton />
            </div>
            <Suspense fallback={<EstablishmentListSkeleton />}>
                <EstablishmentList />
            </Suspense>
            <EstablishmentDialog />
            <EstablishmentDeleteDialog />
        </div>
    );
}
