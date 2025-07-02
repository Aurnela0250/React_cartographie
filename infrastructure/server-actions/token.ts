import { redirect } from "next/navigation";

import { getAuthTokens } from "@/shared/utils/auth-utils";

export async function getTokenServerSide(): Promise<string> {
    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        redirect("/login");
    }

    return accessToken;
}
