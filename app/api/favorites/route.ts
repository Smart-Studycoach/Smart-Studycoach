import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/infrastructure/utils/requireAuth";
import { userService, moduleService } from "@/infrastructure/container";

export async function GET(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId } = authResult;

    const modules = await userService.getFavoriteModules(userId);

    return NextResponse.json({ modules });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json({ modules: [] }, { status: 500 });
  }
}