import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getInjection } from "@/di/container";
import {
    AuthenticationError,
    UnauthenticatedError,
} from "@/src/entities/errors/auth";

import { CitiesFilterClient } from "./cities-filter-client";
import type { FilterOption } from "./filter-types";

async function filterCitiesForFilter(): Promise<FilterOption[]> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const filterCitiesController = getInjection("IFilterCitiesController");

        const result = await filterCitiesController(accessToken, {
            params: {
                perPage: 100,
                page: 1,
            },
            filters: {
                haveEstablishment: true,
            },
        });

        const { items } = result;

        return items.map((city) => ({
            id: city.id,
            name: city.name,
        }));
    } catch (error) {
        if (
            error instanceof UnauthenticatedError ||
            error instanceof AuthenticationError
        ) {
            redirect("/sign-in");
        }
        throw error;
    }
}

export async function CitiesFilter() {
    let availableCities: FilterOption[] = [];

    try {
        availableCities = await filterCitiesForFilter();
    } catch (error) {
        throw error;
    }
    return <CitiesFilterClient options={availableCities} />;
}
