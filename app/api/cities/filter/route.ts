import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { CityFilter } from "@/core/filters/city.filter";
import { CityApiRepository } from "@/infrastructure/repositories/city.repository";
import { getAuthTokens } from "@/shared/utils/auth-utils";

export async function GET(req: NextRequest) {
    try {
        const { accessToken } = await getAuthTokens();

        if (!accessToken) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);

        const filters: CityFilter = {
            page: Number(searchParams.get("page") ?? 1),
            perPage: Number(searchParams.get("per_page") ?? 10),
            nameContains: searchParams.get("name") || null,
            regionId: searchParams.get("regionId")
                ? Number(searchParams.get("regionId"))
                : null,
        };

        const repo = new CityApiRepository();
        const result = await repo.filter(accessToken, filters);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching filtered cities:", error);

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
