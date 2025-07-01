import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { IFormation } from "@/core/entities/formation.entity";
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

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const authResult = await authHandler();

    if (authResult.error) return authResult.error;
    const { accessToken } = authResult;

    try {
        const formation = await repository.get(
            accessToken,
            parseInt(params.id, 10)
        );

        if (!formation) {
            return NextResponse.json(
                { error: "Formation not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(formation);
    } catch (error) {
        const errorMsg =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const authResult = await authHandler();

    if (authResult.error) return authResult.error;
    const { accessToken } = authResult;

    try {
        const body = await request.json();
        const updatedFormation = await repository.update(
            accessToken,
            parseInt(params.id, 10),
            body as Partial<
                Omit<
                    IFormation,
                    | "id"
                    | "createdAt"
                    | "updatedAt"
                    | "createdBy"
                    | "updatedBy"
                    | "level"
                    | "mention"
                    | "establishment"
                    | "authorization"
                    | "annualHeadcounts"
                >
            >
        );

        return NextResponse.json(updatedFormation);
    } catch (error) {
        const errorMsg =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const authResult = await authHandler();

    if (authResult.error) return authResult.error;
    const { accessToken } = authResult;

    try {
        await repository.delete(accessToken, parseInt(params.id, 10));

        return NextResponse.json(
            { message: "Formation deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        const errorMsg =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}
