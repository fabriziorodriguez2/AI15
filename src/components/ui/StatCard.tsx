import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  /** Marca el dato como demostración. */
  isDemo?: boolean;
  className?: string;
}

/** Tarjeta compacta para mostrar una métrica clave. */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  isDemo,
  className,
}: StatCardProps) {
  return (
    <div className={cn("card p-5", className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-texto/50">
          {label}
        </p>
        {Icon && (
          <span className="grid size-8 place-items-center rounded-lg bg-rosa-claro text-rosa">
            <Icon size={16} aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="mt-2 font-display text-2xl font-bold text-ciruela">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-texto/60">{hint}</p>}
      {isDemo && (
        <span className="mt-2 inline-block rounded-full bg-dorado/15 px-2 py-0.5 text-[10px] font-semibold text-dorado">
          Dato de demostración
        </span>
      )}
    </div>
  );
}
