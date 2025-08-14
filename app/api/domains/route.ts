import { NextResponse } from "next/server";
import { instanceToPlain } from "class-transformer";

import { DomainApiRepository } from "@/infrastructure/repositories/domain.repository";
import {
    apiAuthWrapper,
    AuthenticatedRequest,
} from "@/infrastructure/services/api-auth-wrapper.service";

const repo = new DomainApiRepository();

// Handler GET protégé
async function handleGet(request: AuthenticatedRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page") || 1);
        const perPage = Number(searchParams.get("per_page") || 100);

        const data = await repo.getAll(request.accessToken, {
            page,
            perPage,
        });
        const plainData = JSON.parse(JSON.stringify(data));

        return NextResponse.json(plainData);
    } catch (error) {
        const errorMsg =
            error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}

// Handler POST protégé
async function handlePost(
    request: AuthenticatedRequest
): Promise<NextResponse> {
    try {
        const body = await request.json();
        const domain = await repo.create(request.accessToken, body);
        const plainDomain = instanceToPlain(domain);

        return NextResponse.json(plainDomain);
    } catch (error) {
        const errorMsg =
            error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}

// Export des handlers avec authentification automatique
export const GET = apiAuthWrapper.createProtectedHandler(handleGet);
export const POST = apiAuthWrapper.createAdminHandler(handlePost);
