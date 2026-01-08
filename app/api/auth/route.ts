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

// Update name or email
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

    const body = await request.json();
    const rawName = typeof body?.name === "string" ? body.name : undefined;
    const rawEmail = typeof body?.email === "string" ? body.email : undefined;

    const name = rawName?.trim();
    const email = rawEmail?.trim();

    if (!name && !email) {
      return NextResponse.json(
        { error: "No fields provided for update" },
        { status: 400 }
      );
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }
    }

    const updateData: { name?: string; email?: string } = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;

    // Update user
    const updatedUser = await authApplicationService.updateUser(
      authResult.userId,
      updateData
    );

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Update user failed:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
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

    const res = NextResponse.json({ message: "User deleted successfully" });
    try {
      // Clear the auth cookie
      res.cookies.set("token", "", { httpOnly: true, path: "/", maxAge: 0 });
    } catch (e) {
      console.error("Failed to clear auth cookie:", e);
    }
    return res;
  } catch (error) {
    console.error("Delete user failed:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
