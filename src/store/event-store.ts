"use client";

import { create } from "zustand";
import type {
  AIBudgetDistribution,
  AIPlan,
  AIPlanContent,
  BudgetAllocationItem,
  EventDecision,
  EventProfile,
  Expense,
  Guest,
  Inspiration,
  PlanningTask,
  Provider,
  ProviderCategory,
  SelectedProvider,
} from "@/types";
import type { CreateEventInput } from "@/lib/validations/event";
import type { ExpenseFormInput } from "@/lib/validations/expense";
import type { TaskFormInput } from "@/lib/validations/task";
import type { DecisionFormInput } from "@/lib/validations/decision";
import type { ProviderFormInput } from "@/lib/validations/provider";
import { generateId } from "@/lib/utils/id";
import { computeInputFingerprint } from "@/lib/utils/fingerprint";
import { buildSeedTasks } from "@/lib/utils/timeline";
import { buildDemoEvent } from "@/data/demo-event";

interface Collections {
  event: EventProfile | null;
  expenses: Expense[];
  tasks: PlanningTask[];
  guests: Guest[];
  decisions: EventDecision[];
  inspirations: Inspiration[];
  providers: Provider[];
  selectedProviders: SelectedProvider[];
  aiPlan: AIPlan | null;
  aiBudget: AIBudgetDistribution | null;
}

interface EventActions {
  createEvent: (input: CreateEventInput) => EventProfile;
  updateEvent: (input: CreateEventInput) => void;
  clearEvent: () => void;
  /** Carga un evento de demostración y siembra el cronograma base. */
  loadDemoEvent: () => void;
  setProfilePhoto: (dataUrl?: string) => void;

  addGuest: (name: string) => void;
  toggleGuest: (id: string) => void;
  deleteGuest: (id: string) => void;

  addExpense: (input: ExpenseFormInput) => void;
  updateExpense: (id: string, input: ExpenseFormInput) => void;
  deleteExpense: (id: string) => void;

  addTask: (input: TaskFormInput) => void;
  updateTask: (id: string, input: TaskFormInput) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string, status: PlanningTask["status"]) => void;
  seedBaseTasks: () => void;
  /** Importa las tareas del plan de IA al cronograma (source "ai"). */
  importPlanTasks: (
    items: {
      title: string;
      description: string;
      dueDate: string;
      priority: PlanningTask["priority"];
    }[],
  ) => number;

  addDecision: (input: DecisionFormInput) => void;
  updateDecision: (id: string, input: DecisionFormInput) => void;
  deleteDecision: (id: string) => void;

  addInspiration: (data: {
    originalFilename: string;
    userDescription: string;
    localPreview?: string;
    analysis?: Inspiration["analysis"];
  }) => void;
  updateInspiration: (id: string, patch: Partial<Inspiration>) => void;
  deleteInspiration: (id: string) => void;

  addProvider: (input: ProviderFormInput) => void;
  updateProvider: (id: string, input: ProviderFormInput) => void;
  deleteProvider: (id: string) => void;

  selectProvider: (providerId: string, category: ProviderCategory) => void;
  unselectProvider: (id: string) => void;
  updateSelectedProvider: (
    id: string,
    patch: Partial<Pick<SelectedProvider, "status" | "notes">>,
  ) => void;

  saveAIPlan: (args: {
    content: AIPlanContent;
    budgetAllocation: BudgetAllocationItem[];
    model: string;
  }) => void;
  markAIPlanOutdated: () => void;
  clearAIPlan: () => void;

  saveAIBudget: (args: {
    allocations: BudgetAllocationItem[];
    model: string;
  }) => void;
  clearAIBudget: () => void;

  setHasHydrated: (value: boolean) => void;
}

type EventState = Collections & {
  hasHydrated: boolean;
} & EventActions;

const EMPTY: Collections = {
  event: null,
  expenses: [],
  tasks: [],
  guests: [],
  decisions: [],
  inspirations: [],
  providers: [],
  selectedProviders: [],
  aiPlan: null,
  aiBudget: null,
};

/** Fingerprint del plan (excluye gastos: no invalidan el plan estético). */
function planFingerprint(c: Collections): string {
  return computeInputFingerprint({
    event: c.event,
    decisions: c.decisions,
    selectedProviders: c.selectedProviders,
    expenses: [],
  });
}

/** Fingerprint de la distribución de presupuesto (incluye gastos). */
function budgetFingerprint(c: Collections): string {
  return computeInputFingerprint({
    event: c.event,
    decisions: c.decisions,
    selectedProviders: c.selectedProviders,
    expenses: c.expenses,
  });
}

/**
 * Recalcula las banderas de desactualización de plan y distribución sin
 * borrarlos: si las entradas cambiaron, el resultado guardado queda marcado
 * como desactualizado.
 */
function withOutdatedFlags(c: Collections): Partial<Collections> {
  const result: Partial<Collections> = {};
  if (c.aiPlan) {
    const outdated = planFingerprint(c) !== c.aiPlan.inputFingerprint;
    if (outdated !== c.aiPlan.isOutdated) {
      result.aiPlan = { ...c.aiPlan, isOutdated: outdated };
    }
  }
  if (c.aiBudget) {
    const outdated = budgetFingerprint(c) !== c.aiBudget.inputFingerprint;
    if (outdated !== c.aiBudget.isOutdated) {
      result.aiBudget = { ...c.aiBudget, isOutdated: outdated };
    }
  }
  return result;
}

const now = () => new Date().toISOString();

function buildHardcodedState(): Collections {
  const event = buildDemoEvent();
  const tasks: PlanningTask[] = buildSeedTasks(event.id, event.eventDate).map(
    (task, index) => ({
      ...task,
      id: `demo-task-${index + 1}`,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }),
  );
  return { ...EMPTY, event, tasks };
}

/**
 * Store de sesión con un usuario fijo. No utiliza localStorage: al recargar la
 * aplicación se restaura el perfil demo y sus datos iniciales.
 */
export const useEventStore = create<EventState>((set, get) => ({
      ...buildHardcodedState(),
      hasHydrated: true,

      createEvent: (input) => {
        const timestamp = now();
        const event: EventProfile = {
          id: generateId("event"),
          honoreeName: input.honoreeName,
          eventDate: input.eventDate,
          department: input.department,
          city: input.city,
          guestCount: input.guestCount,
          confirmedGuestCount: input.confirmedGuestCount ?? 0,
          totalBudget: input.totalBudget,
          currency: input.currency,
          styles: input.styles,
          themeDescription: input.themeDescription ?? "",
          favoriteColors: input.favoriteColors ?? [],
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        // Crear un evento nuevo reinicia el resto del estado.
        set({ ...EMPTY, event });
        return event;
      },

      updateEvent: (input) => {
        const current = get().event;
        if (!current) return;
        const event: EventProfile = {
          ...current,
          honoreeName: input.honoreeName,
          eventDate: input.eventDate,
          department: input.department,
          city: input.city,
          guestCount: input.guestCount,
          confirmedGuestCount: input.confirmedGuestCount ?? 0,
          totalBudget: input.totalBudget,
          currency: input.currency,
          styles: input.styles,
          themeDescription: input.themeDescription ?? "",
          favoriteColors: input.favoriteColors ?? [],
          updatedAt: now(),
        };
        const templateDates = new Map(
          buildSeedTasks(current.id, input.eventDate).map((task) => [
            task.title,
            task.dueDate,
          ]),
        );
        const tasks = get().tasks.map((task) => {
          const recalculatedDate = templateDates.get(task.title);
          return recalculatedDate
            ? { ...task, dueDate: recalculatedDate, updatedAt: now() }
            : task;
        });
        const next = { ...get(), event, tasks };
        set({ event, tasks, ...withOutdatedFlags(next) });
      },

      clearEvent: () => set({ ...buildHardcodedState() }),

      setProfilePhoto: (dataUrl) => {
        const event = get().event;
        if (!event) return;
        set({ event: { ...event, profilePhoto: dataUrl, updatedAt: now() } });
      },

      addGuest: (name) => {
        const event = get().event;
        const cleanName = name.trim();
        if (!event || !cleanName) return;
        const guest: Guest = {
          id: generateId("guest"),
          eventId: event.id,
          name: cleanName,
          confirmed: false,
          createdAt: now(),
        };
        set({ guests: [...get().guests, guest] });
      },

      toggleGuest: (id) => {
        const guests = get().guests.map((guest) =>
          guest.id === id ? { ...guest, confirmed: !guest.confirmed } : guest,
        );
        const event = get().event;
        set({
          guests,
          event: event
            ? {
                ...event,
                confirmedGuestCount: guests.filter((guest) => guest.confirmed).length,
                updatedAt: now(),
              }
            : event,
        });
      },

      deleteGuest: (id) => {
        const guests = get().guests.filter((guest) => guest.id !== id);
        const event = get().event;
        set({
          guests,
          event: event
            ? {
                ...event,
                confirmedGuestCount: guests.filter((guest) => guest.confirmed).length,
                updatedAt: now(),
              }
            : event,
        });
      },

      loadDemoEvent: () => {
        set({ ...buildHardcodedState() });
      },

      addExpense: (input) => {
        const event = get().event;
        if (!event) return;
        const expense: Expense = {
          id: generateId("exp"),
          eventId: event.id,
          category: input.category,
          description: input.description,
          amount: input.amount,
          currency: event.currency,
          status: input.status,
          createdAt: now(),
          updatedAt: now(),
        };
        const expenses = [...get().expenses, expense];
        set({ expenses, ...withOutdatedFlags({ ...get(), expenses }) });
      },

      updateExpense: (id, input) => {
        const expenses = get().expenses.map((e) =>
          e.id === id
            ? {
                ...e,
                category: input.category,
                description: input.description,
                amount: input.amount,
                status: input.status,
                updatedAt: now(),
              }
            : e,
        );
        set({ expenses, ...withOutdatedFlags({ ...get(), expenses }) });
      },

      deleteExpense: (id) => {
        const expenses = get().expenses.filter((e) => e.id !== id);
        set({ expenses, ...withOutdatedFlags({ ...get(), expenses }) });
      },

      addTask: (input) => {
        const event = get().event;
        if (!event) return;
        const task: PlanningTask = {
          id: generateId("task"),
          eventId: event.id,
          title: input.title,
          description: input.description ?? "",
          dueDate: input.dueDate,
          category: input.category,
          priority: input.priority,
          status: "pending",
          source: "user",
          createdAt: now(),
          updatedAt: now(),
        };
        set({ tasks: [...get().tasks, task] });
      },

      updateTask: (id, input) => {
        set({
          tasks: get().tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  title: input.title,
                  description: input.description ?? "",
                  dueDate: input.dueDate,
                  category: input.category,
                  priority: input.priority,
                  updatedAt: now(),
                }
              : t,
          ),
        });
      },

      deleteTask: (id) =>
        set({ tasks: get().tasks.filter((t) => t.id !== id) }),

      toggleTaskStatus: (id, status) => {
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, status, updatedAt: now() } : t,
          ),
        });
      },

      seedBaseTasks: () => {
        const event = get().event;
        if (!event) return;
        const seeds = buildSeedTasks(event.id, event.eventDate);
        const existingTitles = new Set(get().tasks.map((t) => t.title));
        const newTasks: PlanningTask[] = seeds
          .filter((s) => !existingTitles.has(s.title))
          .map((s) => ({
            ...s,
            id: generateId("task"),
            createdAt: now(),
            updatedAt: now(),
          }));
        set({ tasks: [...get().tasks, ...newTasks] });
      },

      importPlanTasks: (items) => {
        const event = get().event;
        if (!event) return 0;
        const existingTitles = new Set(get().tasks.map((t) => t.title));
        const created: PlanningTask[] = items
          .filter((i) => i.title && !existingTitles.has(i.title))
          .map((i) => ({
            id: generateId("task"),
            eventId: event.id,
            title: i.title,
            description: i.description,
            dueDate: i.dueDate,
            category: "otros",
            priority: i.priority,
            status: "pending",
            source: "ai",
            createdAt: now(),
            updatedAt: now(),
          }));
        if (created.length > 0) {
          set({ tasks: [...get().tasks, ...created] });
        }
        return created.length;
      },

      addDecision: (input) => {
        const event = get().event;
        if (!event) return;
        const decision: EventDecision = {
          id: generateId("dec"),
          eventId: event.id,
          category: input.category,
          title: input.title,
          value: input.value,
          notes: input.notes ?? "",
          confirmed: input.confirmed ?? false,
          createdAt: now(),
          updatedAt: now(),
        };
        const decisions = [...get().decisions, decision];
        set({ decisions, ...withOutdatedFlags({ ...get(), decisions }) });
      },

      updateDecision: (id, input) => {
        const decisions = get().decisions.map((d) =>
          d.id === id
            ? {
                ...d,
                category: input.category,
                title: input.title,
                value: input.value,
                notes: input.notes ?? "",
                confirmed: input.confirmed ?? false,
                updatedAt: now(),
              }
            : d,
        );
        set({ decisions, ...withOutdatedFlags({ ...get(), decisions }) });
      },

      deleteDecision: (id) => {
        const decisions = get().decisions.filter((d) => d.id !== id);
        set({ decisions, ...withOutdatedFlags({ ...get(), decisions }) });
      },

      addInspiration: (data) => {
        const event = get().event;
        if (!event) return;
        const inspiration: Inspiration = {
          id: generateId("insp"),
          eventId: event.id,
          originalFilename: data.originalFilename,
          userDescription: data.userDescription,
          localPreview: data.localPreview,
          analysis: data.analysis ?? null,
          createdAt: now(),
        };
        set({ inspirations: [...get().inspirations, inspiration] });
      },

      updateInspiration: (id, patch) => {
        set({
          inspirations: get().inspirations.map((i) =>
            i.id === id ? { ...i, ...patch } : i,
          ),
        });
      },

      deleteInspiration: (id) =>
        set({
          inspirations: get().inspirations.filter((i) => i.id !== id),
        }),

      addProvider: (input) => {
        const event = get().event;
        if (!event) return;
        const provider: Provider = {
          id: generateId("prov"),
          eventId: event.id,
          name: input.name,
          category: input.category,
          department: input.department,
          city: input.city,
          priceFrom: input.priceFrom ?? 0,
          priceTo: input.priceTo ?? 0,
          currency: input.currency,
          capacity: input.capacity,
          description: input.description ?? "",
          tags: [],
          contact: input.contact || undefined,
          website: input.website || undefined,
          instagram: input.instagram || undefined,
          notes: input.notes || undefined,
          isMock: false,
          createdAt: now(),
          updatedAt: now(),
        };
        set({ providers: [...get().providers, provider] });
      },

      updateProvider: (id, input) => {
        set({
          providers: get().providers.map((p) =>
            p.id === id
              ? {
                  ...p,
                  name: input.name,
                  category: input.category,
                  department: input.department,
                  city: input.city,
                  priceFrom: input.priceFrom ?? 0,
                  priceTo: input.priceTo ?? 0,
                  currency: input.currency,
                  capacity: input.capacity,
                  description: input.description ?? "",
                  contact: input.contact || undefined,
                  website: input.website || undefined,
                  instagram: input.instagram || undefined,
                  notes: input.notes || undefined,
                  updatedAt: now(),
                }
              : p,
          ),
        });
      },

      deleteProvider: (id) => {
        set({
          providers: get().providers.filter((p) => p.id !== id),
          selectedProviders: get().selectedProviders.filter(
            (s) => s.providerId !== id,
          ),
        });
      },

      selectProvider: (providerId, category) => {
        const event = get().event;
        if (!event) return;
        if (get().selectedProviders.some((s) => s.providerId === providerId))
          return;
        const selected: SelectedProvider = {
          id: generateId("sel"),
          eventId: event.id,
          providerId,
          category,
          status: "considering",
          notes: "",
          createdAt: now(),
        };
        const selectedProviders = [...get().selectedProviders, selected];
        set({
          selectedProviders,
          ...withOutdatedFlags({ ...get(), selectedProviders }),
        });
      },

      unselectProvider: (id) => {
        const selectedProviders = get().selectedProviders.filter(
          (s) => s.id !== id,
        );
        set({
          selectedProviders,
          ...withOutdatedFlags({ ...get(), selectedProviders }),
        });
      },

      updateSelectedProvider: (id, patch) => {
        const selectedProviders = get().selectedProviders.map((s) =>
          s.id === id ? { ...s, ...patch } : s,
        );
        set({
          selectedProviders,
          ...withOutdatedFlags({ ...get(), selectedProviders }),
        });
      },

      saveAIPlan: ({ content, budgetAllocation, model }) => {
        const event = get().event;
        if (!event) return;
        const plan: AIPlan = {
          id: generateId("plan"),
          eventId: event.id,
          content,
          budgetAllocation,
          generatedAt: now(),
          model,
          inputFingerprint: planFingerprint(get()),
          isOutdated: false,
        };
        set({ aiPlan: plan });
      },

      markAIPlanOutdated: () => {
        const plan = get().aiPlan;
        if (plan) set({ aiPlan: { ...plan, isOutdated: true } });
      },

      clearAIPlan: () => set({ aiPlan: null }),

      saveAIBudget: ({ allocations, model }) => {
        const event = get().event;
        if (!event) return;
        const budget: AIBudgetDistribution = {
          allocations,
          generatedAt: now(),
          model,
          inputFingerprint: budgetFingerprint(get()),
          isOutdated: false,
        };
        set({ aiBudget: budget });
      },

      clearAIBudget: () => set({ aiBudget: null }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }));
