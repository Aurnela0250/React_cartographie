import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getInjection } from "@/di/container";
import {
    AuthenticationError,
    UnauthenticatedError,
} from "@/src/entities/errors/auth";

import type { FilterOption } from "./filter-types";
import { EstablishmentTypesFilterClient } from "./establishment-types-filter-client";

async function getEstablishmentTypesForFilter(): Promise<FilterOption[]> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const getEstablishmentTypesController = getInjection(
            "IGetEstablishmentTypesController"
        );

        const result = await getEstablishmentTypesController(accessToken, {
            params: {
                perPage: 100,
                page: 1,
            },
        });

        const { items } = result;

        return items.map((t: any) => ({
            id: t.id,
            name: t.name ?? String(t.id),
        }));
    } catch (error) {
        if (
            error instanceof UnauthenticatedError ||
            error instanceof AuthenticationError
        ) {
            redirect("/login");
        }
        throw error;
    }
}

export async function EstablishmentTypesFilter() {
    let options: FilterOption[] = [];

    try {
        options = await getEstablishmentTypesForFilter();
    } catch (error) {
        throw error;
    }

    return <EstablishmentTypesFilterClient options={options} />;
}
