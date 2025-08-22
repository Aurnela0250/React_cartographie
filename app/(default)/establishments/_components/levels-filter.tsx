import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getInjection } from "@/di/container";
import {
    AuthenticationError,
    UnauthenticatedError,
} from "@/src/entities/errors/auth";

import type { FilterOption } from "./filter-types";
import { LevelsFilterClient } from "./levels-filter-client";

async function getLevelsForFilter(): Promise<FilterOption[]> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const getLevelsController = getInjection("IGetLevelsController");

        const result = await getLevelsController(accessToken, {
            params: {
                perPage: 100,
                page: 1,
            },
        });

        const { items } = result;

        return items.map((level) => ({
            id: level.id,
            name: `${level.name} (${level.acronym || ""})`,
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

export async function LevelsFilter() {
    let availableLevels: FilterOption[] = [];

    try {
        availableLevels = await getLevelsForFilter();
    } catch (error) {
        throw error;
    }

    return <LevelsFilterClient options={availableLevels} />;
}
