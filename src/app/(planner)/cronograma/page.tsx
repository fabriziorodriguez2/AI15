"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  RotateCcw,
  CircleDot,
  Sparkles,
  CalendarPlus,
} from "lucide-react";
import { useEventStore } from "@/store/event-store";
import { useStoreReady } from "@/store/use-hydrated-event";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TaskForm } from "@/components/timeline/TaskForm";
import {
  TASK_CATEGORY_LABELS,
  TASK_STATUS_LABELS,
  type PlanningTask,
  type TaskStatus,
} from "@/types";
import { sortTasksByDate, isTaskOverdue } from "@/lib/utils/tasks";
import { groupTasksByPeriod } from "@/lib/utils/timeline";
import { cn } from "@/lib/utils/cn";

type Filter = "todas" | TaskStatus | "vencidas";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "pending", label: "Pendientes" },
  { key: "in_progress", label: "En progreso" },
  { key: "completed", label: "Completadas" },
  { key: "vencidas", label: "Vencidas" },
];

export default function CronogramaPage() {
  const ready = useStoreReady();
  const event = useEventStore((s) => s.event);
  const tasks = useEventStore((s) => s.tasks);
  const addTask = useEventStore((s) => s.addTask);
  const updateTask = useEventStore((s) => s.updateTask);
  const deleteTask = useEventStore((s) => s.deleteTask);
  const toggleTaskStatus = useEventStore((s) => s.toggleTaskStatus);
  const seedBaseTasks = useEventStore((s) => s.seedBaseTasks);

  const [filter, setFilter] = useState<Filter>("todas");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PlanningTask | null>(null);
  const [toDelete, setToDelete] = useState<PlanningTask | null>(null);

  const sorted = useMemo(() => sortTasksByDate(tasks), [tasks]);
  const filtered = useMemo(() => {
    if (filter === "todas") return sorted;
    if (filter === "vencidas") return sorted.filter(isTaskOverdue);
    return sorted.filter((t) => t.status === filter);
  }, [sorted, filter]);
  const grouped = useMemo(
    () => groupTasksByPeriod(filtered, event?.eventDate ?? ""),
    [filtered, event?.eventDate],
  );

  if (!ready) return <div className="h-40" aria-hidden="true" />;

  if (!event) {
    return (
      <EmptyState
        title="Sin cronograma todavía"
        description="Creá tu fiesta para armar tu cronograma con fechas calculadas."
        ctaLabel="Crear mi fiesta"
        ctaHref="/crear-evento"
      />
    );
  }

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Cronograma"
        subtitle="Tus tareas, agrupadas según cuánto falta para la fiesta."
        action={
          <button onClick={openNew} className="btn-primary px-4 py-2 text-xs">
            <Plus size={15} aria-hidden="true" />
            Tarea
          </button>
        }
      />

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={cn(
              "min-h-11 rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
              filter === f.key
                ? "border-rosa bg-rosa text-white"
                : "border-rosa-claro bg-white text-ciruela hover:bg-rosa-claro/40",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <div className="surface-section px-5 text-center">
          <p className="text-sm text-texto/60">
            Todavía no tenés tareas. Podés cargar una lista base sugerida
            (con fechas calculadas desde tu fiesta) o crear la tuya.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <button onClick={seedBaseTasks} className="btn-primary">
              <CalendarPlus size={16} aria-hidden="true" />
              Cargar tareas sugeridas
            </button>
            <button onClick={openNew} className="btn-secondary">
              <Plus size={16} aria-hidden="true" />
              Crear una tarea
            </button>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface-section px-5 text-center text-sm text-texto/60">
          No hay tareas en este filtro.
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <section key={group.label}>
              <div className="mb-2 flex items-center gap-3">
                <h2 className="font-display text-lg font-bold text-ciruela">
                  {group.label}
                </h2>
                <span className="h-px flex-1 bg-[#eadfe5]" />
              </div>
              <ul className="divide-y divide-[#eadfe5] rounded-2xl border border-[#eadfe5] bg-white px-4 shadow-card">
          {group.tasks.map((task) => {
            const overdue = isTaskOverdue(task);
            return (
              <li
                key={task.id}
                className={cn(
                  "py-4",
                  task.status === "completed" && "opacity-70",
                )}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() =>
                      toggleTaskStatus(
                        task.id,
                        task.status === "completed" ? "pending" : "completed",
                      )
                    }
                    aria-label={
                      task.status === "completed"
                        ? "Reabrir tarea"
                        : "Completar tarea"
                    }
                    className={cn(
                      "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 transition",
                      task.status === "completed"
                        ? "border-dorado bg-dorado text-white"
                        : "border-rosa text-transparent hover:bg-rosa-claro",
                    )}
                  >
                    <Check size={13} aria-hidden="true" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm font-semibold text-ciruela",
                          task.status === "completed" && "line-through",
                        )}
                      >
                        {task.title}
                      </p>
                      <div className="flex shrink-0 gap-1">
                        <button
                          onClick={() => {
                            setEditing(task);
                            setFormOpen(true);
                          }}
                          aria-label="Editar tarea"
                          className="grid size-11 place-items-center rounded-lg text-texto/50 hover:bg-rosa-fondo hover:text-ciruela"
                        >
                          <Pencil size={14} aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => setToDelete(task)}
                          aria-label="Eliminar tarea"
                          className="grid size-11 place-items-center rounded-lg text-texto/50 hover:bg-[#c0392b]/10 hover:text-[#c0392b]"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {task.description && (
                      <p className="mt-0.5 text-xs text-texto/60">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                      {overdue && (
                        <span className="font-medium text-[#c0392b]">
                          Vencida
                        </span>
                      )}
                      <span className="text-texto/40">
                        {TASK_CATEGORY_LABELS[task.category]}
                      </span>
                      <span className="inline-flex items-center gap-1 text-texto/40">
                        {task.source === "ai" ? (
                          <>
                            <Sparkles size={11} aria-hidden="true" /> IA
                          </>
                        ) : (
                          "Tuya"
                        )}
                      </span>
                      {task.status === "in_progress" && (
                        <span className="inline-flex items-center gap-1 text-rosa">
                          <CircleDot size={11} aria-hidden="true" />
                          {TASK_STATUS_LABELS.in_progress}
                        </span>
                      )}
                    </div>

                    {/* Cambiar a en progreso / reabrir */}
                    <div className="mt-2 flex gap-2">
                      {task.status !== "completed" && (
                        <button
                          onClick={() =>
                            toggleTaskStatus(
                              task.id,
                              task.status === "in_progress"
                                ? "pending"
                                : "in_progress",
                            )
                          }
                          className="min-h-9 rounded-lg border border-rosa-claro px-2.5 py-1 text-[11px] font-medium text-ciruela hover:bg-rosa-claro/40"
                        >
                          {task.status === "in_progress"
                            ? "Marcar pendiente"
                            : "Marcar en progreso"}
                        </button>
                      )}
                      {task.status === "completed" && (
                        <button
                          onClick={() => toggleTaskStatus(task.id, "pending")}
                          className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-rosa-claro px-2.5 py-1 text-[11px] font-medium text-ciruela hover:bg-rosa-claro/40"
                        >
                          <RotateCcw size={11} aria-hidden="true" />
                          Reabrir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
              </ul>
            </section>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        title={editing ? "Editar tarea" : "Nueva tarea"}
        onClose={() => setFormOpen(false)}
      >
        <TaskForm
          initial={editing ?? undefined}
          onCancel={() => setFormOpen(false)}
          onSubmit={(input) => {
            if (editing) updateTask(editing.id, input);
            else addTask(input);
            setFormOpen(false);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="¿Eliminar tarea?"
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteTask(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
