import { redirect } from "next/navigation";

import { auth } from "@/auth";

export async function getTokenServerSide(): Promise<string> {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return session.accessToken;
}
