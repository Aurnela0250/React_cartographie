import { Suspense } from "react";

import { StatusFilterClient } from "./status-filter-client";

export async function StatusFilter() {
    // Static options handled in the client component; no server fetch needed
    return (
        <Suspense>
            <StatusFilterClient />
        </Suspense>
    );
}
