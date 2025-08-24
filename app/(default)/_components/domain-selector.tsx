import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
    DEFAULT_LOGIN_REDIRECT,
    DEFAULT_LOGOUT_REDIRECT,
} from "@/core/constants/route";
import { getInjection } from "@/di/container";
import {
    AuthenticationError,
    UnauthenticatedError,
} from "@/src/entities/errors/auth";

import { DomainSelectorClient } from "./domain-selector-client";

async function getDomainsForSelector() {
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
            value: domain.id?.toString() || "",
            label: domain.name || "",
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
 * Domain Selector server component that fetches data and passes to client component
 * Combines server-side data fetching with client-side interactivity
 */
export async function DomainSelector() {
    let availableDomains: { value: string; label: string }[] = [];

    try {
        availableDomains = await getDomainsForSelector();
    } catch (error) {
        throw error;
    }

    return <DomainSelectorClient availableDomains={availableDomains} />;
}
