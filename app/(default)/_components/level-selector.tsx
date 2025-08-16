import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getInjection } from "@/di/container";
import {
    AuthenticationError,
    UnauthenticatedError,
} from "@/src/entities/errors/auth";
import { LevelSelectorClient } from "./level-selector-client";

async function getLevelsForSelector() {
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
            value: level.id?.toString() || "",
            label: level.name || "",
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

/**
 * Level Selector server component that fetches data and passes to client component
 * Combines server-side data fetching with client-side interactivity
 */
export async function LevelSelector() {
    let availableLevels: { value: string; label: string }[] = [];

    try {
        availableLevels = await getLevelsForSelector();
    } catch (error) {
        throw error;
    }

    return <LevelSelectorClient availableLevels={availableLevels} />;
}
