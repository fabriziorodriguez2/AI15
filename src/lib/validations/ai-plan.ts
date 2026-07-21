import { z } from "zod";

const priorityEnum = z.enum(["low", "medium", "high"]);

const budgetAllocationItemSchema = z.object({
  category: z.string().trim().min(1).max(60),
  percentage: z.number().min(0).max(100),
  reasoning: z.string().trim().min(1).max(600),
});

const timelineItemSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(600).default(""),
  dueDate: z
    .string()
    .trim()
    .refine((v) => !Number.isNaN(new Date(`${v}T00:00:00`).getTime()), {
      message: "Fecha inválida",
    }),
  category: z.string().trim().min(1).max(60),
  priority: priorityEnum,
});

const styleProposalSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(1200),
  palette: z.array(z.string().trim().min(1).max(40)).min(1).max(12),
  decoration: z.string().trim().max(1200).default(""),
  cake: z.string().trim().max(1200).default(""),
  centerpieces: z.string().trim().max(1200).default(""),
  invitations: z.string().trim().max(1200).default(""),
  hairAndMakeup: z.string().trim().max(1200).default(""),
  lighting: z.string().trim().max(1200).default(""),
});

const recommendationSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(800),
  priority: priorityEnum,
  category: z.string().trim().min(1).max(60),
});

const warningSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(800),
});

/** Esquema completo del plan tal como debe devolverlo la IA. */
export const aiPlanContentSchema = z.object({
  summary: z.string().trim().min(1).max(2000),
  budgetAllocation: z.array(budgetAllocationItemSchema).min(1).max(15),
  timeline: z.array(timelineItemSchema).min(1).max(30),
  styleProposal: styleProposalSchema,
  recommendations: z.array(recommendationSchema).min(1).max(20),
  warnings: z.array(warningSchema).max(20).default([]),
});

export type AIPlanContentParsed = z.infer<typeof aiPlanContentSchema>;

/** Distribución de presupuesto (feature independiente del plan completo). */
export const aiBudgetSchema = z.object({
  allocations: z.array(budgetAllocationItemSchema).min(1).max(15),
});

export type AIBudgetParsed = z.infer<typeof aiBudgetSchema>;
