import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/infrastructure/container";
import { requireAuth } from "@/infrastructure/utils/requireAuth";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ module_id: string }> }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return NextResponse.json({ favorite: false });
    }

    const { userId } = authResult;

    const params = await context.params;

    const { module_id } = params;
    const moduleId = Number(module_id);

    if (Number.isNaN(moduleId)) {
      return NextResponse.json(
        { error: "Invalid module id: " + module_id },
        { status: 400 }
      );
    }

    const favorite = await userService.hasFavoritedModule(userId, moduleId);

    return NextResponse.json({ favorite });
  } catch (error) {
    console.error("Failed to check favorite", error);
    return NextResponse.json(
      { error: "Failed to check favorite" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ module_id: string }> }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId } = authResult;

    const params = await context.params;

    const { module_id } = params;
    const moduleId = Number(module_id);

    if (Number.isNaN(moduleId)) {
      return NextResponse.json({ error: "Invalid module id" }, { status: 400 });
    }

    const success = await userService.toggleFavoriteModule(
      userId,
      moduleId,
      true
    );

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update favorite" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update favorite" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ module_id: string }> }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId } = authResult;

    const params = await context.params;

    const { module_id } = params;
    const moduleId = Number(module_id);

    if (Number.isNaN(moduleId)) {
      return NextResponse.json({ error: "Invalid module id" }, { status: 400 });
    }

    const success = await userService.toggleFavoriteModule(
      userId,
      moduleId,
      false
    );

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update favorite" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      succes: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update favorite" },
      { status: 500 }
    );
  }
}
