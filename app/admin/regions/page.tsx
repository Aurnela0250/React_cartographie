import React, { Suspense } from "react";

import { RegionAddButton } from "./components/region-add-button";
import { RegionDeleteDialog } from "./components/region-delete-dialog";
import { RegionDialog } from "./components/region-dialog";
import { RegionList } from "./components/region-list";
import { RegionListSkeleton } from "./components/region-list-skeleton";

export default function RegionPage() {
    return (
        <div className="container space-y-6 py-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Régions</h1>
                <RegionAddButton />
            </div>

            <Suspense fallback={<RegionListSkeleton />}>
                <RegionList />
            </Suspense>

            {/* Les dialogs sont des portails, ils peuvent être ici */}
            <RegionDialog />
            <RegionDeleteDialog />
        </div>
    );
}
