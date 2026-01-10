import { cookies } from "next/headers";
import { ModuleCard } from "@/components/ModuleCard";
import { Module } from "@/domain/entities/Module";

async function getFavoriteModules(): Promise<Module[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/favorites/modules`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data.modules || [];
}

export default async function FavoritesPage() {
  const userCookies = await cookies();
  const userId = userCookies.get("userId")?.value;

  const modules = userId ? await getFavoriteModules() : [];

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