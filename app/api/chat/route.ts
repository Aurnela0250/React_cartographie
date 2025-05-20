import { NextRequest, NextResponse } from "next/server";

import { ChatApiRepository } from "@/infrastructure/repositories/chat.repository";
import { getServerActionSession } from "@/infrastructure/server-actions/get-session.action";

const repo = new ChatApiRepository();

export async function POST(req: NextRequest) {
    const session = await getServerActionSession();

    if (!session.isLoggedIn || !session.token?.accessToken) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const body = await req.json();

    try {
        const chat = await repo.sendMessage(session.token.accessToken, body);

        return NextResponse.json(chat);
    } catch (e) {
        const errorMsg = e instanceof Error ? e.message : "Erreur inconnue";

        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}
