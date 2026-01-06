import { NextRequest } from "next/server";
import { authService } from "@/infrastructure/container";

type AuthError = "no-token" | "invalid";

/**
 * Extracts a Bearer token from the `Authorization` header.
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Prefer Authorization header if present
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Fallback to HttpOnly cookie named `token` (set on login/register)
  try {
    const cookie = request.cookies.get("token");
    if (cookie) return typeof cookie === "string" ? cookie : cookie.value;
  } catch (e) {
    // ignore and return null
  }

  return null;
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
