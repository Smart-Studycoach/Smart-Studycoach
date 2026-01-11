import { NextResponse } from "next/server";
import { moduleService } from "@/infrastructure/container";
import { ModuleFilters } from "@/domain";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check if IDs are provided
    const idsParam = searchParams.get('ids');
    if (idsParam) {
      const ids = idsParam.split(',').map(id => Number.parseInt(id, 10)).filter(id => !Number.isNaN(id));
      const modules = await moduleService.getModulesByIds(ids);
      return NextResponse.json({ modules });
    }
    
    const filters: ModuleFilters = {};
    
    const name = searchParams.get('name');
    if (name) filters.name = name;
    
    const level = searchParams.get('level');
    if (level) filters.level = level;
    
    const studyCredit = searchParams.get('studyCredit');
    if (studyCredit) {
      const parsedStudyCredit = Number.parseInt(studyCredit, 10);
      if (!Number.isNaN(parsedStudyCredit)) {
        filters.studycredit = parsedStudyCredit;
      }
    }
    
    const location = searchParams.get('location');
    if (location) filters.location = location;
    
    const difficulty = searchParams.get('difficulty');
    if (difficulty) {
      const parsedDifficulty = Number.parseInt(difficulty, 10);
      if (!Number.isNaN(parsedDifficulty)) {
        filters.estimated_difficulty = parsedDifficulty;
      }
    }
    
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
