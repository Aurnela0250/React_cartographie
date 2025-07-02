import React, { Suspense } from "react";

import { CityAddButton } from "./components/city-add-button";
import { CityDeleteDialog } from "./components/city-delete-dialog";
import { CityDialog } from "./components/city-dialog";
import { CityList } from "./components/city-list";
import { CityListSkeleton } from "./components/city-list-skeleton";

export default function CityPage() {
    return (
        <div className="container space-y-6 py-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Villes</h1>
                <CityAddButton />
            </div>
            <Suspense fallback={<CityListSkeleton />}>
                <CityList />
            </Suspense>
            {/* Les dialogs sont des portails, ils peuvent être ici */}
            <CityDialog />
            <CityDeleteDialog />
        </div>
    );
}
