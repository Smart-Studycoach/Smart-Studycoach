import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { userService } from "@/infrastructure/container";
import { requireAuth } from "@/infrastructure/utils/requireAuth";

export async function POST(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId } = authResult;

    const body = await request.json();
    if (typeof body.module_id !== "number") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const success = await userService.toggleEnrolledModule(
      userId,
      body.module_id,
      true
    );
    if (!success) {
      return NextResponse.json({ error: "Failed to enroll" }, { status: 500 });
    }

    revalidatePath("/modules");

    return NextResponse.json({
      message: "successfully enrolled",
      moduleId: body.module_id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to enroll", message: (error as Error).message },
      { status: 500 }
    );
  }
}
