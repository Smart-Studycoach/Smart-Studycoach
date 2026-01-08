import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ModuleMinimal } from "@/domain";

interface Props {
  module: ModuleMinimal;
}

export function MiniModuleCard({ module }: Props) {
  return (
    <Link href={`/modules/${module.module_id}`} className="block">
      <Card className="mini-card bg-[#323333] border-0 text-white hover:bg-zinc-800/60 transition-colors cursor-pointer">
        <CardContent className="p-3 flex items-center gap-3">
          <div className="mini-avatar bg-[#C6002A] rounded-md flex-shrink-0 w-12 h-12 flex items-center justify-center text-white font-bold">
            {String(module.module_id)}
          </div>
          <div className="mini-body flex-grow">
            <h4 className="mini-title text-sm font-bold truncate">
              {module.name}
            </h4>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
