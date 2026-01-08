import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/infrastructure/container";
import { requireAuth } from "@/infrastructure/utils/requireAuth";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return NextResponse.json({ favorite: false });
    }

    const { userId } = authResult;

    const params = await context.params;

    const { id } = params;
    const moduleId = Number(id);

    if (Number.isNaN(moduleId)) {
      return NextResponse.json(
        { error: "Invalid module id: " + id },
        { status: 400 }
      );
    }

    const favorite = await userService.hasFavoriteModule(userId, moduleId);

    return NextResponse.json({ favorite });
  } catch (error) {
    console.error("Failed to check favorite", error);
    return NextResponse.json(
      { error: "Failed to check favorite" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId } = authResult;

    const params = await context.params;

    const { id } = params;
    const moduleId = Number(id);

    if (Number.isNaN(moduleId)) {
      return NextResponse.json({ error: "Invalid module id" }, { status: 400 });
    }

    const body = await request.json();
    if (typeof body.favorite !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const success = await userService.toggleFavoriteModule(
      userId,
      moduleId,
      body.favorite
    );

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update favorite" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      moduleId,
      favorite: body.favorite,
    });
  } catch (error) {
    console.error("Failed to update favorite", error);
    return NextResponse.json(
      { error: "Failed to update favorite" },
      { status: 500 }
    );
  }
}
