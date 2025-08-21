import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { User, UserSchema } from "@/src/entities/models/user";

import { DEFAULT_LOGOUT_REDIRECT } from "../constants/route";

function _getCurrentUser(options: { redirectIfNotFound: true }): Promise<User>;
function _getCurrentUser(options?: {
    redirectIfNotFound?: false;
}): Promise<User | null>;
async function _getCurrentUser({ redirectIfNotFound = false } = {}) {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;

    if (userCookie == null) {
        if (redirectIfNotFound) return redirect(DEFAULT_LOGOUT_REDIRECT);
        return null;
    }

    return await UserSchema.parseAsync(JSON.parse(userCookie));
}

export const getCurrentUser = cache(_getCurrentUser);
