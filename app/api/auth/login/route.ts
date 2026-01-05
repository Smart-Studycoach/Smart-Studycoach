import { NextRequest, NextResponse } from "next/server";
import { authApplicationService } from "@/infrastructure/container";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await authApplicationService.login({
      email: body.email,
      password: body.password,
    });

    // Set HttpOnly cookie with the JWT so browser will send it automatically
    const res = NextResponse.json(result);
    try {
      res.cookies.set("token", result.token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    } catch (e) {
      // ignore cookie set errors in environments that don't support it
      console.error("Failed to set auth cookie:", e);
    }

    return res;
  } catch (error) {
    console.error("Login failed:", error);

    if (error instanceof Error) {
      if (error.message === "Invalid email or password") {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }
    }

    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
