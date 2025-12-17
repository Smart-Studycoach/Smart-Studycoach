"use client"; // nog wel server gebruiken, en client enkel voor de form.

import SearchBar from "./components/searchbar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Item } from "@/components/ui/item";
import { submitRecommendation } from "./actions";
import { useActionState } from "react";

export default function RecommenderPage() {
  const [recommendations, formAction] = useActionState(
    submitRecommendation,
    null
  );

  return (
    <main>
      <Card className="p-6">
        <form action={formAction} className="space-y-4">
          <SearchBar
            name="interests"
            placeholder="Visuele communicatie, storytelling..."
            buttonText="Indienen"
          />

          <fieldset className="space-y-2">
            <legend className="font-medium">Voorkeursniveau</legend>

            <label className="flex gap-2">
              <input type="radio" name="level" value="" defaultChecked />
              Geen voorkeur
            </label>

            <label className="flex gap-2">
              <input type="radio" name="level" value="NLQF5" />
              NLQF5
            </label>

            <label className="flex gap-2">
              <input type="radio" name="level" value="NLQF6" />
              NLQF6
            </label>
          </fieldset>
        </form>

        {recommendations && (
          <CardContent className="space-y-2">
            {recommendations.map((r) => (
              <div key={r.module_id} className="border p-2">
                <strong>{r.module_name}</strong>
                <div className="text-sm">
                  {r.level} — score {r.score.toFixed(2)}
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </main>
  );
}
