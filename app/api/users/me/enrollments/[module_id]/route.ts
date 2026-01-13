import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { userService } from "@/infrastructure/container";
import { requireAuth } from "@/infrastructure/utils/requireAuth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ module_id: string }> }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId } = authResult;
    const { module_id } = await params;
    const moduleId = Number(module_id);

    if (Number.isNaN(moduleId)) {
      return NextResponse.json(
        { error: "Invalid module id: " + module_id },
        { status: 400 }
      );
    }

    const success = await userService.toggleEnrolledModule(
      userId,
      moduleId,
      false
    );
    if (!success) {
      return NextResponse.json(
        { error: "Failed to unenroll" },
        { status: 500 }
      );
    }

    revalidatePath("/modules");

    return NextResponse.json({
      succes: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to unenroll", message: (error as Error).message },
      { status: 500 }
    );
  }
}
