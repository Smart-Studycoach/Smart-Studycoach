import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/infrastructure/utils/requireAuth";
import { userService } from "@/infrastructure/container";

export async function GET(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId } = authResult;

    const favoriteIds = await userService.getFavoriteModules(userId);

    return NextResponse.json({ favoriteIds });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json({ favoriteIds: [] }, { status: 500 });
  }
}
