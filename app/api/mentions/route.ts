import { NextRequest, NextResponse } from "next/server";

import { MentionApiRepository } from "@/infrastructure/repositories/mention.repository";
import { getServerActionSession } from "@/infrastructure/server-actions/get-session.action";

const repo = new MentionApiRepository();

export async function GET(req: NextRequest) {
    const session = await getServerActionSession();

    if (!session.isLoggedIn || !session.token?.accessToken) {
        return NextResponse.json(
            { message: "Non authentifié" },
            { status: 401 }
        );
    }
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const per_page = Number(searchParams.get("per_page")) || 10;

    const domainId = searchParams.get("domainId")
        ? Number(searchParams.get("domainId"))
        : undefined;
    // Correction : utiliser getAll (comme pour les autres repositories)
    // On ne peut pas passer domainId dans PaginationParams, il faut filtrer côté API ou ici
    let result = await repo.getAll(session.token.accessToken, {
        page,
        perPage: per_page,
    });

    // Filtrage JS côté API si domainId fourni (en attendant un endpoint/filter dédié)
    if (domainId) {
        result = {
            ...result,
            items: result.items.filter((m) => m.domainId === domainId),
            totalItems: result.items.filter((m) => m.domainId === domainId)
                .length,
        };
    }

    return NextResponse.json(result);
}
