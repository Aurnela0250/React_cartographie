import { redirect } from "next/navigation";

import { DEFAULT_LOGOUT_REDIRECT } from "@/core/constants/route";
import { getAuthTokens } from "@/shared/utils/auth-utils";

export async function getTokenServerSide(): Promise<string> {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        redirect(DEFAULT_LOGOUT_REDIRECT);
    }

    return accessToken;
}
