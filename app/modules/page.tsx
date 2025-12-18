import { ModuleCard } from "@/components/ModuleCard";
import { ModulePagination } from "@/components/ModulePagination";
import { Module } from "@/domain/entities/Module";

const ITEMS_PER_PAGE = 20;

async function getModules(): Promise<Module[]> {
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
  searchParams: { page?: string };
}) {
  const modules = await getModules();
  const currentPage = Number(searchParams.page) || 1;
  const totalPages = Math.ceil(modules.length / ITEMS_PER_PAGE);
  
  // Calculate pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedModules = modules.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          Welkom bij de modules
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Toont {startIndex + 1} - {Math.min(endIndex, modules.length)} van {modules.length} modules
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
          {paginatedModules.length > 0 ? (
            paginatedModules.map((module) => (
              <ModuleCard
                key={module._id}
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
