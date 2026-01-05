import { NextRequest, NextResponse } from "next/server";
import { authApplicationService } from "@/infrastructure/container";
import { getUserIdFromRequest } from "@/infrastructure/utils/auth";

export async function GET(request: NextRequest) {
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

    // Get current user
    const user = await authApplicationService.getCurrentUser(authResult.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get current user failed:", error);
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
}

// Delete user
export async function DELETE(request: NextRequest) {
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

    // Delete user
    const success = await authApplicationService.deleteUser(authResult.userId);
    if (!success) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user failed:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
