import { NextResponse } from "next/server";

import { getInjection } from "@/di/container";
import {
    apiAuthWrapper,
    AuthenticatedRequest,
} from "@/infrastructure/services/api-auth-wrapper.service";

// Handler GET protégé - utilise Clean Architecture /src
async function handleGet(request: AuthenticatedRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page") || 1);
        const perPage = Number(searchParams.get("per_page") || 10);

        // Utilisation du controller /src via DI Container
        const getCitiesController = getInjection("IGetCitiesController");
        
        const data = await getCitiesController(request.accessToken, {
            params: {
                page,
                perPage,
            },
        });

        // Serialize the data to ensure it's JSON-safe
        const plainData = JSON.parse(JSON.stringify(data));

        return NextResponse.json(plainData);
    } catch (error) {
        const errorMsg =
            error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}

// Handler POST protégé (admin uniquement) - utilise Clean Architecture /src
async function handlePost(
    request: AuthenticatedRequest
): Promise<NextResponse> {
    try {
        const body = await request.json();
        
        // TODO: Implémenter le create controller dans /src
        // Pour l'instant, utilisons directement le repository via DI
        const citiesRepository = getInjection("ICitiesRepository");
        const city = await citiesRepository.createCity(request.accessToken, body);

        return NextResponse.json(city);
    } catch (error) {
        const errorMsg =
            error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}

// Export des handlers avec authentification automatique
export const GET = apiAuthWrapper.createProtectedHandler(handleGet);
export const POST = apiAuthWrapper.createAdminHandler(handlePost);
