import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { LevelApiRepository } from "@/infrastructure/repositories/level.repository";
import { getCurrentUser } from "@/shared/utils/auth-utils";

const repo = new LevelApiRepository();

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
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const authResult = await authHandler();

    if (authResult.error) return authResult.error;
    const { accessToken } = authResult;

    try {
        const id = Number(params.id);

        if (!id) {
            return NextResponse.json({ error: "ID invalide" }, { status: 400 });
        }

        const level = await repo.get(accessToken, id);

        return NextResponse.json(level);
    } catch (error) {
        const errorMsg =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const authResult = await authHandler();

    if (authResult.error) return authResult.error;
    const { accessToken } = authResult;

    try {
        const id = Number(params.id);

        if (!id) {
            return NextResponse.json({ error: "ID invalide" }, { status: 400 });
        }

        const body = await req.json();
        // Remplacer 'code' par 'acronyme' si besoin (compatibilité front)
        const { name, code, acronyme, ...rest } = body;
        const data = { name, acronyme: acronyme ?? code, ...rest };
        const level = await repo.update(accessToken, id, data);

        return NextResponse.json(level);
    } catch (error) {
        const errorMsg =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const authResult = await authHandler();

    if (authResult.error) return authResult.error;
    const { accessToken } = authResult;

    try {
        const id = Number(params.id);

        if (!id) {
            return NextResponse.json({ error: "ID invalide" }, { status: 400 });
        }

        await repo.delete(accessToken, id);

        return NextResponse.json({ success: true });
    } catch (error) {
        const errorMsg =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred";

        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}
