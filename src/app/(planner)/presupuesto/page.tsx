"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Sparkles, RefreshCw } from "lucide-react";
import { useEventStore } from "@/store/event-store";
import { useStoreReady } from "@/store/use-hydrated-event";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ExpenseForm } from "@/components/budget/ExpenseForm";
import { DEFAULT_BUDGET_DISTRIBUTION } from "@/data/budget";
import {
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_STATUS_LABELS,
  type Expense,
} from "@/types";
import { computeBudgetTotals } from "@/lib/utils/budget";
import { formatCurrency, amountFromPercent } from "@/lib/utils/currency";
import { buildAIContext } from "@/lib/ai/build-context";
import { requestBudget } from "@/lib/ai/request";
import { formatShortDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

const STATUS_STYLES: Record<Expense["status"], string> = {
  estimated: "bg-rosa-fondo text-texto/60",
  reserved: "bg-rosa-claro text-rosa",
  paid: "bg-dorado/15 text-dorado",
};

export default function PresupuestoPage() {
  const ready = useStoreReady();
  const event = useEventStore((s) => s.event);
  const expenses = useEventStore((s) => s.expenses);
  const tasks = useEventStore((s) => s.tasks);
  const decisions = useEventStore((s) => s.decisions);
  const selectedProviders = useEventStore((s) => s.selectedProviders);
  const providers = useEventStore((s) => s.providers);
  const inspirations = useEventStore((s) => s.inspirations);
  const aiBudget = useEventStore((s) => s.aiBudget);
  const addExpense = useEventStore((s) => s.addExpense);
  const updateExpense = useEventStore((s) => s.updateExpense);
  const deleteExpense = useEventStore((s) => s.deleteExpense);
  const saveAIBudget = useEventStore((s) => s.saveAIBudget);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [toDelete, setToDelete] = useState<Expense | null>(null);
  const [aiState, setAiState] = useState<"idle" | "loading">("idle");
  const [aiError, setAiError] = useState<string | null>(null);

  const totals = useMemo(
    () => computeBudgetTotals(expenses, event?.totalBudget ?? 0),
    [expenses, event?.totalBudget],
  );

  if (!ready) return <div className="h-40" aria-hidden="true" />;

  if (!event) {
    return (
      <EmptyState
        title="Sin presupuesto todavía"
        description="Creá tu fiesta para registrar tus gastos y ver tu saldo."
        ctaLabel="Crear mi fiesta"
        ctaHref="/crear-evento"
      />
    );
  }

  const currency = event.currency;

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (expense: Expense) => {
    setEditing(expense);
    setFormOpen(true);
  };

  const generateDistribution = async () => {
    setAiState("loading");
    setAiError(null);
    const context = buildAIContext({
      event,
      expenses,
      tasks,
      decisions,
      selectedProviders,
      providers,
      inspirations,
    });
    const res = await requestBudget(context);
    if (res.ok) {
      saveAIBudget({ allocations: res.allocations, model: res.model });
    } else {
      setAiError(res.error);
    }
    setAiState("idle");
  };

  return (
    <div>
      <PageHeader
        title="Presupuesto"
        subtitle="Registrá tus gastos reales y controlá tu saldo."
        action={
          <button onClick={openNew} className="btn-primary px-4 py-2 text-xs">
            <Plus size={15} aria-hidden="true" />
            Gasto
          </button>
        }
      />

      {/* Resumen */}
      <div className="card mb-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-texto/50">
              Presupuesto total
            </p>
            <p className="font-display text-2xl font-bold text-ciruela">
              {formatCurrency(event.totalBudget, currency)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-texto/50">
              Saldo disponible
            </p>
            <p
              className={cn(
                "font-display text-2xl font-bold",
                totals.available < 0 ? "text-[#c0392b]" : "text-ciruela",
              )}
            >
              {formatCurrency(totals.available, currency)}
            </p>
          </div>
        </div>

        <ProgressBar
          className="mt-4"
          value={totals.usedPercent}
          label="Comprometido"
        />
        {totals.isOverBudget && (
          <p className="mt-2 rounded-lg bg-[#c0392b]/10 px-3 py-2 text-xs font-medium text-[#c0392b]">
            Estás por encima del presupuesto por{" "}
            {formatCurrency(Math.abs(totals.available), currency)}.
          </p>
        )}

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {(
            [
              ["Estimado", totals.estimated],
              ["Reservado", totals.reserved],
              ["Pagado", totals.paid],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="rounded-xl bg-rosa-fondo p-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-texto/50">
                {label}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-ciruela">
                {formatCurrency(value, currency)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Distribución con IA */}
      <div className="mb-6 rounded-xl border border-[#e2d3a8] bg-white p-5 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-dorado/10 text-[#8f7420]">
              <Sparkles size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-ciruela">
                Distribución inteligente
              </h2>
              <p className="mt-1 text-sm text-texto/70">
                AI15 propone cómo repartir tu presupuesto según tu ciudad,
                invitados, estilo y decisiones.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={generateDistribution}
          disabled={aiState === "loading"}
          className="btn-primary mt-4 w-full"
        >
          {aiState === "loading" ? (
            <>
              <RefreshCw size={16} className="animate-spin" aria-hidden="true" />
              Generando…
            </>
          ) : aiBudget ? (
            <>
              <RefreshCw size={16} aria-hidden="true" />
              Regenerar distribución
            </>
          ) : (
            <>
              <Sparkles size={16} aria-hidden="true" />
              Generar distribución con IA
            </>
          )}
        </button>

        {aiError && (
          <p className="mt-3 rounded-lg bg-[#c0392b]/10 px-3 py-2 text-xs font-medium text-[#c0392b]">
            {aiError}
          </p>
        )}

        {aiBudget && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-[11px] text-texto/50">
              <span>
                {aiBudget.model} · {formatShortDate(new Date(aiBudget.generatedAt))}
              </span>
              {aiBudget.isOutdated && (
                <span className="font-semibold text-dorado">
                  Desactualizada
                </span>
              )}
            </div>
            <ul className="divide-y divide-rosa-claro">
              {aiBudget.allocations.map((a) => (
                <li key={a.category} className="py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize text-ciruela">
                      {a.category}
                    </span>
                    <span className="text-sm font-semibold text-ciruela">
                      {a.percentage}% ·{" "}
                      {formatCurrency(a.amount, currency)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-texto/60">{a.reasoning}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!aiBudget && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold text-texto/50">
              Distribución orientativa inicial (plantilla genérica)
            </p>
            <ul className="divide-y divide-rosa-claro">
              {DEFAULT_BUDGET_DISTRIBUTION.map((cat) => (
                <li
                  key={cat.key}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span className="text-texto/70">{cat.label}</span>
                  <span className="font-medium text-ciruela">
                    {cat.percent}% ·{" "}
                    {formatCurrency(
                      amountFromPercent(event.totalBudget, cat.percent),
                      currency,
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Lista de gastos */}
      <h2 className="mb-3 font-display text-lg font-bold text-ciruela">
        Gastos ({expenses.length})
      </h2>

      {expenses.length === 0 ? (
        <div className="surface-section px-5 text-center">
          <p className="text-sm text-texto/60">
            Todavía no registraste gastos. Agregá el primero para empezar a
            controlar tu presupuesto.
          </p>
          <button onClick={openNew} className="btn-primary mt-4">
            <Plus size={16} aria-hidden="true" />
            Agregar gasto
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-[#eadfe5] rounded-xl border border-[#eadfe5] bg-white px-4 shadow-card">
          {expenses.map((expense) => (
            <li key={expense.id} className="flex min-h-16 items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-ciruela">
                    {expense.description}
                  </p>
                  <span
                    className={cn(
                      "shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold",
                      STATUS_STYLES[expense.status],
                    )}
                  >
                    {EXPENSE_STATUS_LABELS[expense.status]}
                  </span>
                </div>
                <p className="text-xs text-texto/50">
                  {EXPENSE_CATEGORY_LABELS[expense.category]}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-ciruela">
                {formatCurrency(expense.amount, currency)}
              </span>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => openEdit(expense)}
                  aria-label="Editar gasto"
                  className="grid size-11 place-items-center rounded-lg text-texto/50 hover:bg-rosa-fondo hover:text-ciruela"
                >
                  <Pencil size={15} aria-hidden="true" />
                </button>
                <button
                  onClick={() => setToDelete(expense)}
                  aria-label="Eliminar gasto"
                  className="grid size-11 place-items-center rounded-lg text-texto/50 hover:bg-[#c0392b]/10 hover:text-[#c0392b]"
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={formOpen}
        title={editing ? "Editar gasto" : "Nuevo gasto"}
        onClose={() => setFormOpen(false)}
      >
        <ExpenseForm
          initial={editing ?? undefined}
          onCancel={() => setFormOpen(false)}
          onSubmit={(input) => {
            if (editing) updateExpense(editing.id, input);
            else addExpense(input);
            setFormOpen(false);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="¿Eliminar gasto?"
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteExpense(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
