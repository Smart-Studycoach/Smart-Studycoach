import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { moduleService } from "@/infrastructure/container";
import { userService } from "@/infrastructure/container";
import { requireAuth } from "@/infrastructure/utils/requireAuth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ module_id: number }> }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId } = authResult;
    const { module_id } = await params;

    const success = await moduleService.updateChosenModule(
      userId,
      module_id,
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
      message: "Successfully unenrolled",
      moduleId: module_id,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to unenroll" }, { status: 500 });
  }
}
