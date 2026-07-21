"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema, type TaskFormInput } from "@/lib/validations/task";
import {
  TASK_CATEGORY_LABELS,
  TASK_CATEGORY_OPTIONS,
  TASK_PRIORITY_LABELS,
  type PlanningTask,
} from "@/types";

interface TaskFormProps {
  initial?: PlanningTask;
  onSubmit: (input: TaskFormInput) => void;
  onCancel: () => void;
}

export function TaskForm({ initial, onSubmit, onCancel }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormInput>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      dueDate: initial?.dueDate ?? "",
      category: initial?.category ?? "otros",
      priority: initial?.priority ?? "medium",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="task-title" className="field-label">
          Título
        </label>
        <input
          id="task-title"
          type="text"
          className="field-input"
          placeholder="Ej: Reservar el salón"
          {...register("title")}
        />
        {errors.title && <p className="field-error">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="task-desc" className="field-label">
          Detalle (opcional)
        </label>
        <textarea
          id="task-desc"
          rows={2}
          className="field-input resize-none"
          {...register("description")}
        />
      </div>

      <div>
        <label htmlFor="task-date" className="field-label">
          Fecha límite
        </label>
        <input
          id="task-date"
          type="date"
          className="field-input"
          {...register("dueDate")}
        />
        {errors.dueDate && (
          <p className="field-error">{errors.dueDate.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="task-cat" className="field-label">
            Categoría
          </label>
          <select id="task-cat" className="field-input" {...register("category")}>
            {TASK_CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {TASK_CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="task-prio" className="field-label">
            Prioridad
          </label>
          <select id="task-prio" className="field-input" {...register("priority")}>
            {(["high", "medium", "low"] as const).map((p) => (
              <option key={p} value={p}>
                {TASK_PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          Guardar
        </button>
      </div>
    </form>
  );
}
