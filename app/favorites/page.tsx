import { cookies } from "next/headers";
import { ModuleCard } from "@/components/ModuleCard";
import { Module } from "@/domain/entities/Module";

async function getFavoriteModules(token: string): Promise<Module[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // First, get the favorite module IDs
  const favoritesRes = await fetch(`${baseUrl}/api/favorites`, {
    cache: "no-store",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!favoritesRes.ok) return [];

  const favoritesData = await favoritesRes.json();
  const favoriteIds: number[] = favoritesData.favoriteIds || [];

  if (favoriteIds.length === 0) return [];

  // Then, fetch the actual module data for those IDs
  const modulesRes = await fetch(`${baseUrl}/api/modules?ids=${favoriteIds.join(',')}`, {
    cache: "no-store",
  });

  if (!modulesRes.ok) return [];

  const modulesData = await modulesRes.json();
  return modulesData.modules || [];
}

export default async function FavoritesPage() {
  const userCookies = await cookies();
  const token = userCookies.get("token")?.value;

  const modules = token ? await getFavoriteModules(token) : [];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          Mijn Favorieten
        </h1>

        {modules.length === 0 ? (
          <p className="text-muted-foreground">
            Je hebt nog geen modules als favoriet toegevoegd.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
            {modules.map((module) => (
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}