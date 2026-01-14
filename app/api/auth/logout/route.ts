import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json({ message: "Logged out successfully" });
    
    // Clear the HttpOnly cookie
    res.cookies.set("token", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });

    return res;
  } catch (error) {
    console.error("Logout failed:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
