import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchBarProps = {
  placeholder?: string;
  buttonText?: string;
};

export default function SearchBar({
  placeholder = "Search...",
  buttonText = "Search",
}: SearchBarProps) {
  return (
    <div className="flex items-center space-x-2">
      <Input
        type="text"
        className="px-3 py-2 w-200"
        placeholder={placeholder}
      />
      <Button className="px-3 py-2 w-20">{buttonText}</Button>
    </div>
  );
}
