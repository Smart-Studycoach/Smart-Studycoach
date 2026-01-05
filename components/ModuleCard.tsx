import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface ModuleCardProps {
  id: number;
  title: string;
  description: string;
  image?: string;
  tags?: { label: string; variant?: "default" | "secondary" | "accent" }[];
  className?: string;
}

export function ModuleCard({
  id,
  title,
  description,
  image,
  tags = [],
  className = "",
}: ModuleCardProps) {
  return (
    <Link href={`/modules/${id}`} className="block">
      <Card className={`bg-[#323333] border-0 text-white hover:bg-zinc-800/70 transition-colors cursor-pointer ${className}`}>
      {/* Image Section */}
      {image && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardContent className="p-6 space-y-4">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-bold uppercase rounded-xl text-white"
                style={{ backgroundColor: '#C6002A' }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-white leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-300 leading-relaxed">
          {description.split(' ').slice(0, 30).join(' ')}
          {description.split(' ').length > 30 && '...'}
        </p>
      </CardContent>
    </Card>
    </Link>
  );
}
