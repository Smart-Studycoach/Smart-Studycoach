import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/infrastructure/utils/requireAuth";
import { userService, moduleService } from "@/infrastructure/container";

export async function GET(request: NextRequest) {
  const authResult = requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const { userId } = authResult;

  const modules = await userService.getFavoriteModulesDetailed(userId);
  
  return NextResponse.json({ modules });
}