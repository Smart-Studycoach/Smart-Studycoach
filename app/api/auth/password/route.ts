import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/infrastructure/utils/auth";
import { authApplicationService } from "@/infrastructure/container";

// Update password (requires old password verification)
export async function PATCH(request: NextRequest) {
  try {
    const authResult = getUserIdFromRequest(request);
    if ("error" in authResult) {
      return NextResponse.json(
        {
          error:
            authResult.error === "no-token"
              ? "No token provided"
              : "Invalid or expired token",
        },
        { status: 401 }
      );
    }

    const { oldPassword, newPassword } = await request.json();

    // Validate input
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both old and new passwords are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Update password with old password verification
    await authApplicationService.updatePassword(
      authResult.userId,
      oldPassword,
      newPassword
    );

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password failed:", error);

    // Check if error is about incorrect old password
    if (
      error instanceof Error &&
      error.message === "Current password is incorrect"
    ) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
