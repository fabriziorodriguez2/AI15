"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Wallet,
  Users,
  PiggyBank,
  Wallet2,
  Store,
  CalendarClock,
  Check,
  Camera,
  Trash2,
  UsersRound,
} from "lucide-react";
import { useEventStore } from "@/store/event-store";
import { useStoreReady } from "@/store/use-hydrated-event";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AIStatusCard } from "@/components/ui/AIStatusCard";
import { formatCurrency } from "@/lib/utils/currency";
import { daysUntil, formatShortDate, parseEventDate } from "@/lib/utils/date";
import { computeBudgetTotals } from "@/lib/utils/budget";
import { getNextTask } from "@/lib/utils/tasks";
import { calculatePlanningProgress } from "@/lib/utils/progress";
import { cn } from "@/lib/utils/cn";

const QUICK_LINKS = [
  { href: "/presupuesto", label: "Presupuesto", icon: Wallet2 },
  { href: "/proveedores", label: "Proveedores", icon: Store },
  { href: "/invitados", label: "Invitados", icon: UsersRound },
  { href: "/cronograma", label: "Cronograma", icon: CalendarClock },
];

export default function DashboardPage() {
  const ready = useStoreReady();
  const event = useEventStore((s) => s.event);
  const expenses = useEventStore((s) => s.expenses);
  const tasks = useEventStore((s) => s.tasks);
  const decisions = useEventStore((s) => s.decisions);
  const inspirations = useEventStore((s) => s.inspirations);
  const selectedProviders = useEventStore((s) => s.selectedProviders);
  const aiPlan = useEventStore((s) => s.aiPlan);
  const setProfilePhoto = useEventStore((s) => s.setProfilePhoto);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = useState("");

  if (!ready) return <div className="h-40" aria-hidden="true" />;

  if (!event) {
    return (
      <EmptyState
        title="Todavía no creaste tu fiesta"
        description="Primero contanos los datos de tu fiesta de 15 para armar tu panel personalizado."
        ctaLabel="Crear mi fiesta"
        ctaHref="/crear-evento"
      />
    );
  }

  const remaining = daysUntil(event.eventDate);
  const totals = computeBudgetTotals(expenses, event.totalBudget);
  const nextTask = getNextTask(tasks);
  const nextTaskDate = nextTask ? parseEventDate(nextTask.dueDate) : null;
  const progress = calculatePlanningProgress({
    event,
    expenses,
    tasks,
    decisions,
    inspirations,
    selectedProviders,
    aiPlan,
  });

  return (
    <div className="space-y-7">
      <div className="border-b border-[#eadfe5] pb-5">
        <h1 className="font-display text-[28px] font-bold leading-tight text-ciruela">
          ¡Hola, {event.honoreeName}!
        </h1>
        <p className="mt-1 text-sm text-texto/70">
          {remaining !== null && remaining > 0
            ? `Faltan ${remaining} días para tu fiesta.`
            : remaining === 0
              ? "¡Hoy es el gran día!"
              : "Tu fecha ya pasó. Podés editarla desde Cuenta."}
        </p>
      </div>

      <section className="flex items-center gap-4 rounded-2xl bg-[#dcd3aa]/45 p-4">
        <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white shadow-sm">
          {event.profilePhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.profilePhoto}
              alt={`Foto de ${event.honoreeName}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-display text-4xl font-bold text-rosa">
              {event.honoreeName.trim().charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-bold text-ciruela">
            Tu espacio
          </h2>
          <p className="mt-0.5 text-xs leading-relaxed text-texto/65">
            Sumá una foto tuya para hacer este panel más personal.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-white px-3 text-xs font-semibold text-ciruela shadow-sm"
            >
              <Camera size={15} aria-hidden="true" />
              {event.profilePhoto ? "Cambiar foto" : "Subir foto"}
            </button>
            {event.profilePhoto && (
              <button
                type="button"
                onClick={() => setProfilePhoto(undefined)}
                aria-label="Quitar foto"
                className="grid size-10 place-items-center rounded-xl bg-white text-texto/55 shadow-sm"
              >
                <Trash2 size={15} aria-hidden="true" />
              </button>
            )}
          </div>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(eventInput) => {
              const file = eventInput.target.files?.[0];
              if (!file) return;
              if (file.size > 1_500_000) {
                setPhotoError("Elegí una imagen de hasta 1,5 MB.");
                eventInput.target.value = "";
                return;
              }
              const reader = new FileReader();
              reader.onload = () => {
                setProfilePhoto(String(reader.result));
                setPhotoError("");
              };
              reader.readAsDataURL(file);
              eventInput.target.value = "";
            }}
          />
          {photoError && (
            <p className="mt-2 text-[11px] font-medium text-[#a9344f]">
              {photoError}
            </p>
          )}
        </div>
      </section>

      {/* Progreso */}
      <div className="rounded-xl border border-[#eadfe5] bg-white p-5 shadow-card">
        <ProgressBar value={progress.percent} label="Progreso de la planificación" />
      </div>

      {/* Métricas reales */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Días restantes"
          value={remaining !== null ? `${Math.max(remaining, 0)}` : "—"}
          icon={CalendarDays}
        />
        <StatCard
          label="Presupuesto"
          value={formatCurrency(event.totalBudget, event.currency)}
          icon={Wallet}
        />
        <StatCard
          label="Comprometido"
          value={formatCurrency(totals.committed, event.currency)}
          hint={`${Math.round(totals.usedPercent)}% del total`}
          icon={PiggyBank}
        />
        <StatCard
          label="Saldo"
          value={formatCurrency(totals.available, event.currency)}
          icon={Wallet2}
        />
        <StatCard
          label="Invitados confirmados"
          value={`${event.confirmedGuestCount} / ${event.guestCount}`}
          icon={Users}
        />
        <StatCard
          label="Gastos registrados"
          value={`${expenses.length}`}
          icon={Wallet}
        />
      </div>

      {/* Próxima tarea real */}
      <div className="rounded-xl border border-[#eadfe5] bg-white px-5 py-5 shadow-card">
        <p className="text-xs font-medium uppercase tracking-wide text-texto/50">
          Próxima tarea
        </p>
        {nextTask ? (
          <div className="mt-1 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-ciruela">
                {nextTask.title}
              </h2>
              <p className="mt-0.5 text-sm text-texto/60">
                {nextTaskDate ? formatShortDate(nextTaskDate) : nextTask.dueDate}
              </p>
            </div>
            <Link
              href="/cronograma"
              className="btn-secondary shrink-0 px-4 py-2 text-xs"
            >
              Ver
            </Link>
          </div>
        ) : (
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="text-sm text-texto/60">
              No tenés tareas pendientes. Agregá o cargá tu cronograma.
            </p>
            <Link
              href="/cronograma"
              className="btn-secondary shrink-0 px-4 py-2 text-xs"
            >
              Ir
            </Link>
          </div>
        )}
      </div>

      {/* Etapas (derivadas del progreso real) */}
      <div className="rounded-xl border border-[#eadfe5] bg-white p-5 shadow-card">
        <h2 className="mb-4 font-display text-lg font-bold text-ciruela">
          Etapas
        </h2>
        <ul className="grid grid-cols-1 gap-2">
          {progress.items
            .filter((i) => i.key !== "event")
            .map((item) => (
              <li
                key={item.key}
                className="flex items-center justify-between rounded-xl border border-rosa-claro px-4 py-2.5"
              >
                <span className="text-sm font-medium text-ciruela">
                  {item.label}
                </span>
                <span
                  className={cn(
                    "grid size-6 place-items-center rounded-full text-[10px] font-semibold",
                    item.done
                      ? "bg-dorado text-white"
                      : "bg-rosa-fondo text-texto/40",
                  )}
                >
                  {item.done ? (
                    <Check size={13} aria-hidden="true" />
                  ) : (
                    `${Math.round(item.ratio * 100)}%`
                  )}
                </span>
              </li>
            ))}
        </ul>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-2 gap-3">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border border-[#eadfe5] bg-white p-4 text-center shadow-card transition-colors hover:border-rosa/60 hover:bg-rosa-fondo"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-rosa-fondo text-rosa">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-ciruela">
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>

      <AIStatusCard variant="compact" />
    </div>
  );
}
