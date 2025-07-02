import React, { Suspense } from "react";

import { DomainAddButton } from "./components/domain-add-button";
import { DomainDeleteDialog } from "./components/domain-delete-dialog";
import { DomainDialog } from "./components/domain-dialog";
import { DomainList } from "./components/domain-list";
import { DomainListSkeleton } from "./components/domain-list-skeleton";

export default function DomainPage() {
    return (
        <div className="container space-y-6 py-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Domaines</h1>
                <DomainAddButton />
            </div>
            <Suspense fallback={<DomainListSkeleton />}>
                <DomainList />
            </Suspense>
            <DomainDialog />
            <DomainDeleteDialog />
        </div>
    );
}
