import { NextResponse } from "next/server";

import { getInjection } from "@/di/container";
import {
    apiAuthWrapper,
    AuthenticatedRequest,
} from "@/infrastructure/services/api-auth-wrapper.service";

// Handler GET protégé
async function handleGet(request: AuthenticatedRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page") || 1);
        const perPage = Number(searchParams.get("per_page") || 10);

        const getRegionsController = getInjection("IGetRegionsController");

        const data = await getRegionsController(request.accessToken, {
            params: {
                page,
                perPage,
            },
        });

        const plainData = JSON.parse(JSON.stringify(data));

        return NextResponse.json(plainData);
    } catch (error) {
        const errorMsg =
            error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}

// Handler POST protégé (admin uniquement)
async function handlePost(
    request: AuthenticatedRequest
): Promise<NextResponse> {
    try {
        const body = await request.json();
        
        // TODO: Implement region creation via Clean Architecture
        // const createRegionController = getInjection("ICreateRegionController");
        // const region = await createRegionController(request.accessToken, body);

        return NextResponse.json({ message: "Creation not implemented yet" }, { status: 501 });
    } catch (error) {
        const errorMsg =
            error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}

// Export des handlers avec authentification automatique
export const GET = apiAuthWrapper.createProtectedHandler(handleGet);
export const POST = apiAuthWrapper.createAdminHandler(handlePost);
