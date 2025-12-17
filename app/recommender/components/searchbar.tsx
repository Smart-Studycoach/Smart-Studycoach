import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchBarProps = {
  name: string;
  placeholder?: string;
  buttonText?: string;
};

export default function SearchBar({
  name,
  placeholder = "Search...",
  buttonText = "Search",
}: SearchBarProps) {
  return (
    <div className="flex items-center space-x-2">
      <Input
        type="text"
        name={name}
        className="px-3 py-2 w-full"
        placeholder={placeholder}
        required
      />
      <Button type="submit" className="px-3 py-2 w-24">
        {buttonText}
      </Button>
    </div>
  );
}
