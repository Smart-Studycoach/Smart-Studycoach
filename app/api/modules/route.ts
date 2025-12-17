import { NextResponse } from "next/server";

import { moduleService } from "@/infrastructure/container";

export async function GET() {
  try {
    const modules = await moduleService.getAllModules();

    return NextResponse.json({ modules });
  } catch (error) {
    console.error("Failed to fetch modules", error);
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 }
    );
  }
}
