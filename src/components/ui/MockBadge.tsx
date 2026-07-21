import { Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Etiqueta discreta para marcar contenido de demostración. */
export function MockBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-dorado/15 px-2.5 py-1 text-[11px] font-semibold text-dorado",
        className,
      )}
    >
      <Info size={12} aria-hidden="true" />
      Datos de demostración
    </span>
  );
}
