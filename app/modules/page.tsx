import { ModuleCard } from "@/components/ModuleCard";
import { ModulePagination } from "@/components/ModulePagination";
import { ModuleFilters } from "@/components/ModuleFilters";
import { Module } from "@/domain/entities/Module";
import { ModuleFilters as ModuleFiltersType } from "@/domain/repositories/IModuleRepository";
import { cookies } from "next/headers";
import { moduleService, userService, authService } from "@/infrastructure/container";

const ITEMS_PER_PAGE = 20;

async function getFavoriteModuleIds(token: string): Promise<number[]> {
  try {
    const decoded = authService.verifyToken(token);
    if (!decoded?.userId) return [];

    const favoriteIds = await userService.getFavoriteModules(decoded.userId);
    return favoriteIds;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
}

async function getModules(
  searchParams?: Record<string, string>
): Promise<Module[]> {
  try {
    const filters: ModuleFiltersType = {};

    if (searchParams?.name) filters.name = searchParams.name;
    if (searchParams?.level) filters.level = searchParams.level;
    if (searchParams?.studyCredit) {
      const parsedCredit = Number.parseInt(searchParams.studyCredit, 10);
      if (!Number.isNaN(parsedCredit)) {
        filters.studycredit = parsedCredit;
      }
    }
    if (searchParams?.location) filters.location = searchParams.location;
    if (searchParams?.difficulty) {
      const parsedDifficulty = Number.parseInt(searchParams.difficulty, 10);
      if (!Number.isNaN(parsedDifficulty)) {
        filters.estimated_difficulty = parsedDifficulty;
      }
    }

    const modules = await moduleService.getAllModules(filters);
    return modules;
  } catch (error) {
    console.error("Error fetching modules:", error);
    return [];
  }
}

async function getAllModulesForFilters(): Promise<Module[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/modules`, {
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

  // Get user's token
  const userCookies = await cookies();
  const token = userCookies.get("token")?.value;

  // Parallel fetch
  const [modules, allModules, favoriteIds] = await Promise.all([
    getModules(params),
    getAllModulesForFilters(),
    token ? getFavoriteModuleIds(token) : Promise.resolve([]),
  ]);

  const currentPage = Number(params?.page) || 1;
  const totalPages = Math.ceil(modules.length / ITEMS_PER_PAGE);

  // Extract unique filter options from all modules (not filtered)
  const levels = Array.from(new Set(allModules.map((m) => m.level))).filter(
    Boolean
  );
  const studyCredits = Array.from(
    new Set(allModules.map((m) => String(m.studycredit)))
  ).filter(Boolean);
  const locations = Array.from(
    new Set(allModules.flatMap((m) => m.location || []))
  ).filter(Boolean);

  // Pagination
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
          Toont {modules.length > 0 ? startIndex + 1 : 0} -{" "}
          {Math.min(endIndex, modules.length)} van {modules.length} modules
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
                key={module.module_id}
                id={module.module_id}
                title={module.name}
                description={module.description}
                image={`https://picsum.photos/400/300?random=${module.module_id}`}
                tags={[
                  { label: module.location?.[0] || "NL" },
                  { label: `${module.studycredit}ects` },
                  { label: module.level },
                ]}
                isFavorite={favoriteIds.includes(module.module_id)}
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
