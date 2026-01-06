import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "./auth";
import { authService } from "@/infrastructure/container";

/**
 * Simple helper to require authentication inside Next.js route handlers.
 * Returns the decoded payload `{ userId }` when authorized, otherwise returns a 401 `NextResponse`.
 */
export function requireAuth(
  request: NextRequest
): { userId: string } | NextResponse {
  console.log("requireAuth called");
  console.log("Request headers:", request.headers);
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = authService.verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return decoded;
}
