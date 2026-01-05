import { NextResponse } from "next/server";
import { moduleService } from "@/infrastructure/container";
import { ModuleFilters } from "@/domain";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters: ModuleFilters = {};
    
    const name = searchParams.get('name');
    if (name) filters.name = name;
    
    const level = searchParams.get('level');
    if (level) filters.level = level;
    
    const studyCredit = searchParams.get('studyCredit');
    if (studyCredit) filters.studycredit = parseInt(studyCredit);
    
    const location = searchParams.get('location');
    if (location) filters.location = location;
    
    const difficulty = searchParams.get('difficulty');
    if (difficulty) filters.estimated_difficulty = parseInt(difficulty);
    
    const modules = await moduleService.getAllModules(filters);

    return NextResponse.json({ modules });
  } catch (error) {
    console.error("Failed to fetch modules", error);
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 }
    );
  }
}
