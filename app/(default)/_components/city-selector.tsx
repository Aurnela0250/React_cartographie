import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DEFAULT_LOGOUT_REDIRECT } from "@/core/constants/route";
import { getInjection } from "@/di/container";
import {
    AuthenticationError,
    UnauthenticatedError,
} from "@/src/entities/errors/auth";

import { CitySelectorClient } from "./city-selector-client";

async function filterCitiesForSelector() {
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
            value: city.id?.toString() || "",
            label: city.name || "",
        }));
    } catch (error) {
        if (
            error instanceof UnauthenticatedError ||
            error instanceof AuthenticationError
        ) {
            redirect(DEFAULT_LOGOUT_REDIRECT);
        }
        throw error;
    }
}

/**
 * City Selector server component that fetches data and passes to client component
 * Combines server-side data fetching with client-side interactivity
 */
export async function CitySelector() {
    let availableCities: { value: string; label: string }[] = [];

    try {
        availableCities = await filterCitiesForSelector();
    } catch (error) {
        throw error;
    }

    return <CitySelectorClient availableCities={availableCities} />;
}
