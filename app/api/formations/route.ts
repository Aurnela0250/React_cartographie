import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { FormationApiRepository } from "@/infrastructure/repositories/formation.repository";
import { getCurrentUser } from "@/shared/utils/auth-utils";

const repository = new FormationApiRepository();

async function authHandler() {
    const user = await getCurrentUser();

    if (!user) {
        return {
            error: NextResponse.json(
                { message: "Non authentifié" },
                { status: 401 }
            ),
        };
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return {
            error: NextResponse.json(
                { message: "Token manquant" },
                { status: 401 }
            ),
        };
    }

    return { accessToken };
}

export async function GET(request: NextRequest) {
    const authResult = await authHandler();

    if (authResult.error) return authResult.error;
    const { accessToken } = authResult;

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const response = await repository.getAll(accessToken, {
            page,
            perPage: limit,
        });

        return NextResponse.json(response);
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred";

        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const authResult = await authHandler();

    if (authResult.error) return authResult.error;
    const { accessToken } = authResult;

    try {
        const body = await request.json();

        // Validate required fields
        const {
            intitule,
            description,
            duration,
            levelId,
            mentionId,
            establishmentId,
            authorizationId,
        } = body;

        if (
            typeof intitule !== "string" ||
            typeof duration !== "number" ||
            typeof levelId !== "number" ||
            typeof mentionId !== "number" ||
            typeof establishmentId !== "number"
        ) {
            return NextResponse.json(
                { error: "Missing or invalid required fields" },
                { status: 400 }
            );
        }

        const newFormation = await repository.create(accessToken, {
            intitule,
            description,
            duration,
            levelId,
            mentionId,
            establishmentId,
            authorizationId,
        });

        return NextResponse.json(newFormation, { status: 201 });
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred";

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
