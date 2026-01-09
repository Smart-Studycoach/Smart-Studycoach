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

    const isEnrolled = await userService.hasEnrolledInModule(
      userId,
      Number(id)
    );
    const isFavorited = await userService.hasFavoritedModule(
      userId,
      Number(id)
    );

    return NextResponse.json({ module, isEnrolled, isFavorited });
  } catch (error) {
    console.error("Failed to fetch module", error);
    return NextResponse.json(
      { error: "Failed to fetch module" },
      { status: 500 }
    );
  }
}
