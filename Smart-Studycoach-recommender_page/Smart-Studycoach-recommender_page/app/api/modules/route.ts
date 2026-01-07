import { NextResponse } from "next/server";

import { moduleService } from "@/infrastructure/container";

// de validatie logica eigenlijk niet in de route.ts
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
