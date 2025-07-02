import React, { Suspense } from "react";

import { MentionAddButton } from "./components/mention-add-button";
import { MentionDeleteDialog } from "./components/mention-delete-dialog";
import { MentionDialog } from "./components/mention-dialog";
import { MentionList } from "./components/mention-list";
import { MentionListSkeleton } from "./components/mention-list-skeleton";

export default function MentionPage() {
    return (
        <div className="container space-y-6 py-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Mentions</h1>
                <MentionAddButton />
            </div>
            <Suspense fallback={<MentionListSkeleton />}>
                <MentionList />
            </Suspense>
            <MentionDialog />
            <MentionDeleteDialog />
        </div>
    );
}
