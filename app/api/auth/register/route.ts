import { NextRequest, NextResponse } from "next/server";
import { authApplicationService } from "@/infrastructure/container";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // 12 characters
    if (body.password.length < 12) {
      return NextResponse.json(
        { error: "Password must be at least 12 characters long" },
        { status: 400 }
      );
    }

    // Capital letter
    if (!/[A-Z]/.test(body.password)) {
      return NextResponse.json(
        { error: "Password must contain at least one uppercase letter" },
        { status: 400 }
      );
    }

    // Number
    if (!/[0-9]/.test(body.password)) {
        return NextResponse.json(
            { error: "Password must contain at least one number" },
            { status: 400 }
        );
    }

    // Special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(body.password)) {
        return NextResponse.json(
            { error: "Password must contain at least one special character" },
            { status: 400 }
        );
    }

    const result = await authApplicationService.register({
      email: body.email,
      password: body.password,
      name: body.name,
      studentProfile: body.studentProfile,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Registration failed:", error);

    if (error instanceof Error) {
      if (error.message === "User with this email already exists") {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
    }

    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
