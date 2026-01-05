import { ModuleCard } from "@/components/ModuleCard";
import { ModulePagination } from "@/components/ModulePagination";
import { ModuleFilters } from "@/components/ModuleFilters";
import { Module } from "@/domain/entities/Module";

const ITEMS_PER_PAGE = 20;

async function getModules(searchParams?: Record<string, string>): Promise<Module[]> {
  try {
    const params = new URLSearchParams();
    
    // Pass through all filter parameters to the backend
    if (searchParams?.name) params.set('name', searchParams.name);
    if (searchParams?.level) params.set('level', searchParams.level);
    if (searchParams?.studyCredit) params.set('studyCredit', searchParams.studyCredit);
    if (searchParams?.location) params.set('location', searchParams.location);
    if (searchParams?.difficulty) params.set('difficulty', searchParams.difficulty);
    
    const queryString = params.toString();
    const url = `http://localhost:3000/api/modules${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch modules");
    }
    
    const data = await response.json();
    return data.modules || [];
  } catch (error) {
    console.error("Error fetching modules:", error);
    return [];
  }
}

async function getAllModulesForFilters(): Promise<Module[]> {
  try {
    const response = await fetch("http://localhost:3000/api/modules", {
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch modules");
    }
    
    const data = await response.json();
    return data.modules || [];
  } catch (error) {
    console.error("Error fetching modules:", error);
    return [];
  }
}

export default async function Index({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string;
    name?: string;
    level?: string;
    studyCredit?: string;
    location?: string;
    difficulty?: string;
  }>;
}) {
  const params = await searchParams;
  
  // Fetch filtered modules from backend
  const modules = await getModules(params);
  
  // Fetch all modules to populate filter dropdowns
  const allModules = await getAllModulesForFilters();
  
  const currentPage = Number(params?.page) || 1;
  const totalPages = Math.ceil(modules.length / ITEMS_PER_PAGE);
  
  // Extract unique filter options from all modules (not filtered)
  const levels = Array.from(new Set(allModules.map((m) => m.level))).filter(Boolean);
  const studyCredits = Array.from(
    new Set(allModules.map((m) => String(m.studycredit)))
  ).filter(Boolean);
  const locations = Array.from(
    new Set(allModules.flatMap((m) => m.location || []))
  ).filter(Boolean);
  
  // Calculate pagination on already filtered results
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedModules = modules.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          Welkom bij de modules
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Toont {modules.length > 0 ? startIndex + 1 : 0} - {Math.min(endIndex, modules.length)} van {modules.length} modules
        </p>
        
        {/* Filters */}
        <ModuleFilters
          levels={levels}
          studyCredits={studyCredits}
          locations={locations}
          difficulties={[]}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
          {paginatedModules.length > 0 ? (
            paginatedModules.map((module) => (
              <ModuleCard
                key={module._id}
                id={module.id}
                title={module.name}
                description={module.description}
                image={`https://picsum.photos/400/300?random=${module.id}`}
                tags={[
                  { label: module.location[0] || "NL" },
                  { label: `${module.studycredit}ects` },
                  { label: module.level },
                ]}
              />
            ))
          ) : (
            <p className="text-muted-foreground col-span-full text-center py-8">
              Geen modules gevonden.
            </p>
          )}
        </div>

        <ModulePagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
