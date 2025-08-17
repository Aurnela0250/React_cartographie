"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateFiltersAction(searchParams: URLSearchParams) {
    const url = `/establishments${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    // Force revalidation of the establishments page
    revalidatePath("/establishments");

    // Redirect to the new URL
    redirect(url);
}
