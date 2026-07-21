"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  decisionFormSchema,
  type DecisionFormInput,
} from "@/lib/validations/decision";
import {
  DECISION_CATEGORY_LABELS,
  DECISION_CATEGORY_OPTIONS,
  type EventDecision,
} from "@/types";

interface DecisionFormProps {
  initial?: EventDecision;
  onSubmit: (input: DecisionFormInput) => void;
  onCancel: () => void;
}

export function DecisionForm({
  initial,
  onSubmit,
  onCancel,
}: DecisionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DecisionFormInput>({
    resolver: zodResolver(decisionFormSchema),
    defaultValues: {
      category: initial?.category ?? "salon",
      title: initial?.title ?? "",
      value: initial?.value ?? "",
      notes: initial?.notes ?? "",
      confirmed: initial?.confirmed ?? false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="dec-cat" className="field-label">
          Categoría
        </label>
        <select id="dec-cat" className="field-input" {...register("category")}>
          {DECISION_CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>
              {DECISION_CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="dec-title" className="field-label">
          Título
        </label>
        <input
          id="dec-title"
          type="text"
          className="field-input"
          placeholder="Ej: Vestido"
          {...register("title")}
        />
        {errors.title && <p className="field-error">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="dec-value" className="field-label">
          ¿Qué elegiste?
        </label>
        <input
          id="dec-value"
          type="text"
          className="field-input"
          placeholder="Ej: Rosa empolvado con detalles dorados"
          {...register("value")}
        />
        {errors.value && <p className="field-error">{errors.value.message}</p>}
      </div>

      <div>
        <label htmlFor="dec-notes" className="field-label">
          Notas (opcional)
        </label>
        <textarea
          id="dec-notes"
          rows={2}
          className="field-input resize-none"
          {...register("notes")}
        />
      </div>

      <label className="flex items-center gap-2 rounded-xl bg-rosa-fondo px-4 py-3 text-sm text-ciruela">
        <input
          type="checkbox"
          className="size-4 accent-rosa"
          {...register("confirmed")}
        />
        Decisión confirmada (la IA la tratará como restricción)
      </label>

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
