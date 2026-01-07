import { NextRequest, NextResponse } from "next/server";
import { moduleService } from "@/infrastructure/container";
import { userService } from "@/infrastructure/container";
import { requireAuth } from "@/infrastructure/utils/requireAuth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const module = await moduleService.getModuleById(id);

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse)
      return NextResponse.json({ module, module_chosen: false });

    const { userId } = authResult;

    const module_chosen = await userService.hasUserChosenModule(userId, id);

    return NextResponse.json({ module, module_chosen });
  } catch (error) {
    console.error("Failed to fetch module", error);
    return NextResponse.json(
      { error: "Failed to fetch module" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId } = authResult;
    const { id } = await params;

    const body = await request.json();
    if (typeof body.chosen !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const _id = await moduleService.getMongoIdByModuleId(id);

    if (!_id) {
      return NextResponse.json(
        { error: "Failed to update module choice" },
        { status: 404 }
      );
    }

    const success = await moduleService.updateChosenModule(
      userId,
      _id,
      body.chosen
    );
    if (!success) {
      return NextResponse.json(
        { error: "Failed to update module choice" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Module choice updated successfully",
      moduleId: id,
      chosen: body.chosen,
    });
  } catch (error) {
    console.error("Failed to update module choice", error);
    return NextResponse.json(
      { error: "Failed to update module choice" },
      { status: 500 }
    );
  }
}
