import { NextRequest, NextResponse } from "next/server";

import { IFormation } from "@/core/entities/formation.entity";
import { FormationApiRepository } from "@/infrastructure/repositories/formation.repository";
import { getRouteHandlerSession } from "@/shared/utils/auth";

const repository = new FormationApiRepository();

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getRouteHandlerSession(request);
        const token = session.token?.accessToken;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        const formation = await repository.get(token, parseInt(params.id, 10));

        if (!formation) {
            return NextResponse.json(
                { error: "Formation not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(formation);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        const updatedFormation = await repository.update(
            token,
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
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getRouteHandlerSession(request);
        const token = session.token?.accessToken;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        await repository.delete(token, parseInt(params.id, 10));

        return NextResponse.json(
            { message: "Formation deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
