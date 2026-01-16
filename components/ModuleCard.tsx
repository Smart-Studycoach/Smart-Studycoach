import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

interface ModuleCardProps {
  id: number;
  title: string;
  description: string;
  image?: string;
  tags?: { label: string; variant?: "default" | "secondary" | "accent" }[];
  className?: string;
  isFavorite?: boolean;
}

export function ModuleCard({
  id,
  title,
  description,
  image,
  tags = [],
  className = "",
  isFavorite = false,
}: ModuleCardProps) {
  return (
    <Link href={`/modules/${id}`} className="block">
      <Card className={`bg-[#323333] border-0 text-white hover:bg-zinc-800/70 transition-colors cursor-pointer flex flex-col relative ${className}`}>
      {/* Favorite Star Icon */}
      {isFavorite && (
        <div className="absolute top-3 right-3 z-10 bg-[#C6002A] rounded-full p-2 shadow-lg">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      )}
      {/* Image Section */}
      {image && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      <CardContent className="p-6 space-y-4 flex-grow min-h-64">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-bold uppercase rounded-xl text-white bg-[#C6002A]"
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
        <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
          {description}
        </p>
      </CardContent>
    </Card>
    </Link>
  );
}
