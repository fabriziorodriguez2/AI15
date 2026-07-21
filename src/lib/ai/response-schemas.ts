/**
 * responseSchema (formato del proxy/Gemini) para forzar salidas JSON.
 * Deben mantenerse alineados con los esquemas Zod de validación
 * (src/lib/validations/ai-plan.ts).
 */

const priority = { type: "string", enum: ["low", "medium", "high"] };

const budgetAllocationItem = {
  type: "object",
  properties: {
    category: { type: "string" },
    percentage: { type: "number" },
    reasoning: { type: "string" },
  },
  required: ["category", "percentage", "reasoning"],
};

export const planResponseSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    budgetAllocation: { type: "array", items: budgetAllocationItem },
    timeline: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          dueDate: { type: "string" },
          category: { type: "string" },
          priority,
        },
        required: ["title", "description", "dueDate", "category", "priority"],
      },
    },
    styleProposal: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        palette: { type: "array", items: { type: "string" } },
        decoration: { type: "string" },
        cake: { type: "string" },
        centerpieces: { type: "string" },
        invitations: { type: "string" },
        hairAndMakeup: { type: "string" },
        lighting: { type: "string" },
      },
      required: [
        "name",
        "description",
        "palette",
        "decoration",
        "cake",
        "centerpieces",
        "invitations",
        "hairAndMakeup",
        "lighting",
      ],
    },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          priority,
          category: { type: "string" },
        },
        required: ["title", "description", "priority", "category"],
      },
    },
    warnings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
        },
        required: ["title", "description"],
      },
    },
  },
  required: [
    "summary",
    "budgetAllocation",
    "timeline",
    "styleProposal",
    "recommendations",
    "warnings",
  ],
} as const;

export const budgetResponseSchema = {
  type: "object",
  properties: {
    allocations: { type: "array", items: budgetAllocationItem },
  },
  required: ["allocations"],
} as const;
