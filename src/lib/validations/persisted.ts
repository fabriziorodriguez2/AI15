import { z } from "zod";
import {
  EXPENSE_CATEGORY_OPTIONS,
  TASK_CATEGORY_OPTIONS,
  DECISION_CATEGORY_OPTIONS,
  PROVIDER_CATEGORY_OPTIONS,
  PARTY_STYLE_OPTIONS,
  type ExpenseCategory,
  type TaskCategory,
  type DecisionCategory,
  type ProviderCategory,
  type PartyStyle,
} from "@/types";

const currency = z.enum(["UYU", "USD"]);
const iso = z.string();

export const eventProfileSchema = z.object({
  id: z.string(),
  honoreeName: z.string(),
  eventDate: z.string(),
  department: z.string(),
  city: z.string(),
  guestCount: z.number(),
  confirmedGuestCount: z.number().default(0),
  totalBudget: z.number(),
  currency,
  styles: z.array(
    z.enum(PARTY_STYLE_OPTIONS as [PartyStyle, ...PartyStyle[]]),
  ),
  themeDescription: z.string().default(""),
  favoriteColors: z.array(z.string()).default([]),
  createdAt: iso,
  updatedAt: iso,
});

export const expenseSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  category: z.enum(
    EXPENSE_CATEGORY_OPTIONS as [ExpenseCategory, ...ExpenseCategory[]],
  ),
  description: z.string(),
  amount: z.number(),
  currency,
  status: z.enum(["estimated", "reserved", "paid"]),
  createdAt: iso,
  updatedAt: iso,
});

export const taskSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  title: z.string(),
  description: z.string().default(""),
  dueDate: z.string(),
  category: z.enum(TASK_CATEGORY_OPTIONS as [TaskCategory, ...TaskCategory[]]),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in_progress", "completed"]),
  source: z.enum(["user", "ai"]),
  createdAt: iso,
  updatedAt: iso,
});

export const decisionSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  category: z.enum(
    DECISION_CATEGORY_OPTIONS as [DecisionCategory, ...DecisionCategory[]],
  ),
  title: z.string(),
  value: z.string(),
  notes: z.string().default(""),
  confirmed: z.boolean().default(false),
  createdAt: iso,
  updatedAt: iso,
});

export const inspirationSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  originalFilename: z.string(),
  userDescription: z.string().default(""),
  localPreview: z.string().optional(),
  analysis: z.unknown().nullable().default(null),
  createdAt: iso,
});

export const providerSchema = z.object({
  id: z.string(),
  eventId: z.string().optional(),
  name: z.string(),
  category: z.enum(
    PROVIDER_CATEGORY_OPTIONS as [ProviderCategory, ...ProviderCategory[]],
  ),
  department: z.string(),
  city: z.string(),
  priceFrom: z.number().default(0),
  priceTo: z.number().default(0),
  currency,
  capacity: z.number().optional(),
  rating: z.number().optional(),
  description: z.string().default(""),
  tags: z.array(z.string()).default([]),
  contact: z.string().optional(),
  website: z.string().optional(),
  instagram: z.string().optional(),
  notes: z.string().optional(),
  isMock: z.boolean().optional(),
  createdAt: iso.optional(),
  updatedAt: iso.optional(),
});

export const selectedProviderSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  providerId: z.string(),
  category: z.enum(
    PROVIDER_CATEGORY_OPTIONS as [ProviderCategory, ...ProviderCategory[]],
  ),
  status: z.enum(["considering", "contacted", "confirmed", "discarded"]),
  notes: z.string().default(""),
  createdAt: iso,
});

// El plan se guarda con contenido ya validado; aquí lo aceptamos de forma
// tolerante (el detalle se valida al generarlo desde la IA).
export const aiPlanStoredSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  content: z.unknown(),
  budgetAllocation: z.array(z.unknown()).default([]),
  generatedAt: iso,
  model: z.string(),
  inputFingerprint: z.string(),
  isOutdated: z.boolean().default(false),
});

/** Estado persistido completo. Cada colección se valida y descarta lo inválido. */
export const persistedStateSchema = z.object({
  event: eventProfileSchema.nullable().catch(null),
  expenses: z.array(expenseSchema).catch([]),
  tasks: z.array(taskSchema).catch([]),
  decisions: z.array(decisionSchema).catch([]),
  inspirations: z.array(inspirationSchema).catch([]),
  providers: z.array(providerSchema).catch([]),
  selectedProviders: z.array(selectedProviderSchema).catch([]),
  aiPlan: aiPlanStoredSchema.nullable().catch(null),
});

export type PersistedState = z.infer<typeof persistedStateSchema>;
