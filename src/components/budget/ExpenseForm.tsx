"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  expenseFormSchema,
  type ExpenseFormInput,
} from "@/lib/validations/expense";
import {
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_OPTIONS,
  EXPENSE_STATUS_LABELS,
  type Expense,
} from "@/types";

interface ExpenseFormProps {
  initial?: Expense;
  onSubmit: (input: ExpenseFormInput) => void;
  onCancel: () => void;
}

export function ExpenseForm({ initial, onSubmit, onCancel }: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormInput>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      category: initial?.category ?? "salon",
      description: initial?.description ?? "",
      amount: initial?.amount ?? undefined,
      status: initial?.status ?? "estimated",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="exp-desc" className="field-label">
          Descripción
        </label>
        <input
          id="exp-desc"
          type="text"
          className="field-input"
          placeholder="Ej: Seña del salón"
          {...register("description")}
        />
        {errors.description && (
          <p className="field-error">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="exp-cat" className="field-label">
          Categoría
        </label>
        <select id="exp-cat" className="field-input" {...register("category")}>
          {EXPENSE_CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>
              {EXPENSE_CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="exp-amount" className="field-label">
          Importe
        </label>
        <input
          id="exp-amount"
          type="number"
          min={1}
          className="field-input"
          placeholder="Ej: 45000"
          {...register("amount")}
        />
        {errors.amount && <p className="field-error">{errors.amount.message}</p>}
      </div>

      <div>
        <span className="field-label">Estado</span>
        <div className="flex gap-2">
          {(["estimated", "reserved", "paid"] as const).map((st) => (
            <label
              key={st}
              className="flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#dfd3da] bg-white px-2 py-2.5 text-xs font-medium text-ciruela transition has-[:checked]:border-rosa has-[:checked]:bg-rosa-claro/30"
            >
              <input
                type="radio"
                value={st}
                className="accent-rosa"
                {...register("status")}
              />
              {EXPENSE_STATUS_LABELS[st]}
            </label>
          ))}
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
