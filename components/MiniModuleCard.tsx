import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ModuleMinimal } from "@/domain";

interface Props {
  module: ModuleMinimal;
}

export function MiniModuleCard({ module }: Props) {
  return (
    <Link href={`/modules/${module.module_id}`} className="block group">
      <Card className="mini-card bg-[#1F1F1F] border border-zinc-800 text-white hover:border-[#C6002A] hover:bg-[#252525] transition-all duration-200 cursor-pointer h-full">
        <CardContent className="p-4 flex items-start gap-4 h-full">
          <div className="mini-avatar bg-[#C6002A] rounded-lg flex-shrink-0 w-14 h-14 flex items-center justify-center text-white font-bold text-base shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-transform">
            {String(module.module_id)}
          </div>
          <div className="mini-body flex-grow min-w-0">
            <h4 className="mini-title text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-[#C6002A] transition-colors">
              {module.name}
            </h4>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
