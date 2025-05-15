import { NextRequest, NextResponse } from "next/server";

import { FormationApiRepository } from "@/infrastructure/repositories/formation.repository";
import { getRouteHandlerSession } from "@/shared/utils/auth";

const repository = new FormationApiRepository();

export async function GET(request: NextRequest) {
    try {
        const session = await getRouteHandlerSession(request);
        const token = session.token?.accessToken;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const response = await repository.getAll(token, {
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
    try {
        const session = await getRouteHandlerSession(request);
        const token = session.token?.accessToken;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
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

        const newFormation = await repository.create(token, {
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
