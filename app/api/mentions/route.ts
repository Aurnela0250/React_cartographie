import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { MentionApiRepository } from "@/infrastructure/repositories/mention.repository";
import { getCurrentUser } from "@/shared/utils/auth-utils";

const repo = new MentionApiRepository();

export async function GET(req: NextRequest) {
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
        const searchParams = req.nextUrl.searchParams;
        const page = Number(searchParams.get("page")) || 1;
        const perPage = Number(searchParams.get("perPage")) || 10;

        const result = await repo.getAll(accessToken, {
            page,
            perPage,
        });

        return NextResponse.json(result);
    } catch (error) {
        const errorMsg =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}
