import { NextResponse } from "next/server";
import { moduleService } from "@/infrastructure/container";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const module = await moduleService.getModuleById(params.id);

    if (!module) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ module });
  } catch (error) {
    console.error("Failed to fetch module", error);
    return NextResponse.json(
      { error: "Failed to fetch module" },
      { status: 500 }
    );
  }
}