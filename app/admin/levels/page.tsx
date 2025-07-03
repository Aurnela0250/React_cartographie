import React, { Suspense } from "react";

import { LevelAddButton } from "./components/level-add-button";
import { LevelDeleteDialog } from "./components/level-delete-dialog";
import { LevelDialog } from "./components/level-dialog";
import { LevelList } from "./components/level-list";
import { LevelListSkeleton } from "./components/level-list-skeleton";

export default function LevelPage() {
    return (
        <div className="container space-y-6 py-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Niveaux</h1>
                <LevelAddButton />
            </div>
            <Suspense fallback={<LevelListSkeleton />}>
                <LevelList />
            </Suspense>
            <LevelDialog />
            <LevelDeleteDialog />
        </div>
    );
}
