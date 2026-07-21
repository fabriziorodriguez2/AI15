import { cn } from "@/lib/utils/cn";

interface ProgressBarProps {
  /** Valor entre 0 y 100. */
  value: number;
  label?: string;
  className?: string;
}

/** Barra de progreso accesible. */
export function ProgressBar({ value, label, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={className}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-texto/70">
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-rosa-claro"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progreso"}
      >
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-rosa to-dorado transition-all",
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
