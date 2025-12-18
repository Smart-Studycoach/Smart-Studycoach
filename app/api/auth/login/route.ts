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

    return NextResponse.json(result);
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
