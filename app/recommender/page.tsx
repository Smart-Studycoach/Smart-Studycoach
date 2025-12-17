import { recommendationService } from "@/infrastructure/container";
import SearchBar from "./components/searchbar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Item } from "@/components/ui/item";

export default async function RecommenderPage() {
  const interests_text =
    "Visuele communicatie, storytelling, design thinking, co-creatie; ontwikkelpunten planning, feedback verwerken, presentatievaardigheden; competenties creativiteit, empathie, conceptontwikkeling; ervaring brandingproject, interactieve installatie, samenwerking met bedrijven; toekomst brug kunst en technologie.";
  const preferred_level = "NLQF5";
  const recommendations = await recommendationService.RecommendCourses(
    interests_text,
    preferred_level
  );
  return (
    <main>
      <h1>Recommender</h1>
      <Card className="items-center">
        {/*clmin-h-[50vh]*/}
        <SearchBar
          placeholder="Bijvoorbeeld: visuele communicatie, storytelling, design thinking, co-creatie..."
          buttonText="Indienen"
        />
        <CardContent>{recommendations[0].moduleName}</CardContent>
      </Card>
    </main>
  );
}
