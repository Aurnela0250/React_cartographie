import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getInjection } from "@/di/container";
import {
    AuthenticationError,
    UnauthenticatedError,
} from "@/src/entities/errors/auth";

import { DomainsFilterClient } from "./domains-filter-client";
import type { FilterOption } from "./filter-types";
import { DEFAULT_LOGOUT_REDIRECT } from "@/core/constants/route";

async function getDomainsForFilter() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const getDomainsController = getInjection("IGetDomainsController");

        const result = await getDomainsController(accessToken, {
            params: {
                perPage: 100,
                page: 1,
            },
        });

        const { items } = result;

        return items.map((domain) => ({
            id: domain.id,
            name: domain.name,
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

export async function DomainsFilter() {
    let availableDomains: FilterOption[] = [];

    try {
        availableDomains = await getDomainsForFilter();
    } catch (error) {
        throw error;
    }

    return <DomainsFilterClient options={availableDomains} />;
}
