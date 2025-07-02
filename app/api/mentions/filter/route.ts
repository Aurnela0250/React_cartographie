import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { MentionFilter } from "@/core/filters/mention.filter";
import { MentionApiRepository } from "@/infrastructure/repositories/mention.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

export async function GET(req: NextRequest) {
    const repo = new MentionApiRepository();

    const { accessToken } = await getAuthTokens();

    if (!accessToken) {
        return NextResponse.json(
            { message: "Token manquant" },
            { status: 401 }
        );
    }

    try {
        const { searchParams } = new URL(req.url);

        const filters: MentionFilter = {
            page: Number(searchParams.get("page") ?? 1),
            perPage: Number(searchParams.get("per_page") ?? 10),
            nameContains: searchParams.get("name") || null,
            domainId: searchParams.get("domainId")
                ? Number(searchParams.get("domainId"))
                : null,
        };

        const data = await repo.filter(accessToken, filters);

        return NextResponse.json(data);
    } catch (error) {
        const errorMsg =
            error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}
