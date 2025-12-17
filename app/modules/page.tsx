import { moduleService } from "@/infrastructure/container";

export default async function ModulesPage() {
  const modules = await moduleService.getAllModules();

  return (
    <main style={{ padding: 20 }}>
      <h1>Modules</h1>
      {Array.isArray(modules) && modules.length > 0 ? (
        <ul>
          {modules.map((m: any) => (
            <li key={m.id ?? m._id ?? m.name}>{m.name ?? JSON.stringify(m)}</li>
          ))}
        </ul>
      ) : (
        <p>Geen modules gevonden.</p>
      )}
    </main>
  );
}
