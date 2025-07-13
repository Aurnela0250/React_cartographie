import { NextResponse } from "next/server";

import { LevelApiRepository } from "@/infrastructure/repositories/level.repository";
import {
    apiAuthWrapper,
    AuthenticatedRequest,
} from "@/infrastructure/services/api-auth-wrapper.service";

const repo = new LevelApiRepository();

// Handler GET protégé
async function handleGet(request: AuthenticatedRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page")) || 1;
        const perPage = Number(searchParams.get("per_page")) || 10;

        const result = await repo.getAll(request.accessToken, {
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

// Handler POST protégé
async function handlePost(
    request: AuthenticatedRequest
): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { name, acronym, ...rest } = body;
        const data = { name, acronym, ...rest };

        const level = await repo.create(request.accessToken, data);

        return NextResponse.json(level);
    } catch (error) {
        const errorMsg =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}

// Export des handlers avec authentification automatique
export const GET = apiAuthWrapper.createProtectedHandler(handleGet);
export const POST = apiAuthWrapper.createAdminHandler(handlePost);
