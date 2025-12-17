import { moduleService } from "@/infrastructure/container";
import SearchBar from "./components/searchbar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Item } from "@/components/ui/item";

export default async function RecommenderPage() {
  return (
    <main>
      <h1>Recommender</h1>
      <Card className="items-center">
        {/*clmin-h-[50vh]*/}
        <SearchBar
          placeholder="Bijvoorbeeld: visuele communicatie, storytelling, design thinking, co-creatie..."
          buttonText="Indienen"
        />
        <CardContent>content</CardContent>
      </Card>
    </main>
  );
}
