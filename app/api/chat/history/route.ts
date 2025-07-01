import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { ChatApiRepository } from "@/infrastructure/repositories/chat.repository";
import { getCurrentUser } from "@/shared/utils/auth-utils";

const repo = new ChatApiRepository();

export async function GET(_: NextRequest) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    try {
        const history = await repo.getHistory(accessToken);

        return NextResponse.json(history);
    } catch (e) {
        const errorMsg = e instanceof Error ? e.message : "Erreur inconnue";

        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}
