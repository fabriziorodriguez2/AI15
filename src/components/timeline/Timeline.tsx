import { Check, Circle } from "lucide-react";
import type { ComputedTask } from "@/lib/utils/timeline";
import { formatLongDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

/** Línea de tiempo vertical con estado por tarea (pasada / pendiente). */
export function Timeline({ tasks }: { tasks: ComputedTask[] }) {
  return (
    <ol className="relative space-y-6 border-l-2 border-rosa-claro pl-6">
      {tasks.map((task) => (
        <li key={task.id} className="relative">
          <span
            className={cn(
              "absolute -left-[31px] grid size-6 place-items-center rounded-full border-2",
              task.isPast
                ? "border-dorado bg-dorado text-white"
                : "border-rosa bg-white text-rosa",
            )}
            aria-hidden="true"
          >
            {task.isPast ? <Check size={13} /> : <Circle size={9} fill="currentColor" />}
          </span>
          <div
            className={cn(
              "card p-4",
              task.isPast && "border-dashed opacity-70",
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-ciruela">{task.title}</h3>
              <time className="text-xs font-medium text-texto/60">
                {formatLongDate(task.date)}
              </time>
            </div>
            <p className="mt-1 text-sm text-texto/70">{task.detail}</p>
            {task.isPast && (
              <span className="mt-2 inline-block text-[11px] font-semibold uppercase tracking-wide text-dorado">
                Etapa pasada
              </span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
