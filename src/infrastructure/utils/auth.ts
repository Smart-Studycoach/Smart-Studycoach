import { NextRequest } from "next/server";
import { authService } from "@/infrastructure/container";

type AuthError = "no-token" | "invalid";

/**
 * Extracts a Bearer token from the `Authorization` header.
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.substring(7);
}

/**
 * Verify the token present on the request and return the decoded user id
 * or an object containing an error reason.
 *
 * Returns: `{ userId: string }` on success, or `{ error: AuthError }` on failure.
 */
export function getUserIdFromRequest(
  request: NextRequest
): { userId: string } | { error: AuthError } {
  const token = getTokenFromRequest(request);
  if (!token) return { error: "no-token" };

  const decoded = authService.verifyToken(token);
  if (!decoded) return { error: "invalid" };

  return { userId: decoded.userId };
}

export default {
  getTokenFromRequest,
  getUserIdFromRequest,
};
