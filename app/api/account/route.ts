import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/infrastructure/utils/requireAuth";
import { userService } from "@/infrastructure/container";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const profile = await userService.getUserProfile(auth.userId);
  if (!profile)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ profile: profile });
}
