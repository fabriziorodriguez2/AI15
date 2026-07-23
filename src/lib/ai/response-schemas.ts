/**
 * responseSchema (formato del proxy/Gemini) para forzar salidas JSON.
 * Deben mantenerse alineados con los esquemas Zod de validación
 * (src/lib/validations/ai-plan.ts).
 */

const priority = { type: "string", enum: ["low", "medium", "high"] };

const budgetAllocationItem = {
  type: "object",
  properties: {
    category: { type: "string", maxLength: 35 },
    percentage: { type: "number" },
    reasoning: { type: "string", maxLength: 80 },
  },
  required: ["category", "percentage", "reasoning"],
};

const timelineItem = {
  type: "object",
  properties: {
    title: { type: "string", maxLength: 55 },
    description: { type: "string", maxLength: 80 },
    dueDate: { type: "string", maxLength: 10 },
    category: { type: "string", maxLength: 25 },
    priority,
  },
  required: ["title", "description", "dueDate", "category", "priority"],
};

export const planResponseSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    budgetAllocation: {
      type: "array",
      items: budgetAllocationItem,
      minItems: 4,
      maxItems: 4,
    },
    timeline: {
      type: "array",
      items: timelineItem,
      minItems: 3,
      maxItems: 3,
    },
    styleProposal: {
      type: "object",
      properties: {
        name: { type: "string", maxLength: 40 },
        description: { type: "string", maxLength: 140 },
        palette: {
          type: "array",
          items: { type: "string", maxLength: 18 },
          minItems: 3,
          maxItems: 4,
        },
        decoration: { type: "string", maxLength: 60 },
        cake: { type: "string", maxLength: 60 },
        centerpieces: { type: "string", maxLength: 60 },
        invitations: { type: "string", maxLength: 60 },
        hairAndMakeup: { type: "string", maxLength: 60 },
        lighting: { type: "string", maxLength: 60 },
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
        title: { type: "string", maxLength: 50 },
        description: { type: "string", maxLength: 80 },
        priority,
        category: { type: "string", maxLength: 25 },
        },
        required: ["title", "description", "priority", "category"],
      },
    },
    warnings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string", maxLength: 45 },
          description: { type: "string", maxLength: 80 },
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
    allocations: {
      type: "array",
      items: budgetAllocationItem,
      minItems: 4,
      maxItems: 5,
    },
  },
  required: ["allocations"],
} as const;

/** Análisis visual conciso para una inspiración subida por la usuaria. */
export const inspirationAnalysisResponseSchema = {
  type: "object",
  properties: {
    styles: {
      type: "array",
      items: { type: "string", maxLength: 30 },
      minItems: 1,
      maxItems: 4,
    },
    colors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string", maxLength: 25 },
          hex: { type: "string", maxLength: 7 },
        },
        required: ["name", "hex"],
      },
      minItems: 3,
      maxItems: 5,
    },
    mainElements: {
      type: "array",
      items: { type: "string", maxLength: 45 },
      minItems: 2,
      maxItems: 5,
    },
    recommendations: {
      type: "array",
      items: { type: "string", maxLength: 90 },
      minItems: 3,
      maxItems: 5,
    },
    uncertaintyNotes: { type: "string", maxLength: 160 },
  },
  required: [
    "styles",
    "colors",
    "mainElements",
    "recommendations",
    "uncertaintyNotes",
  ],
} as const;

/** Primera mitad del plan: presupuesto y próximos hitos. */
export const planLogisticsResponseSchema = {
  type: "object",
  properties: {
    budgetAllocation: {
      type: "array",
      items: budgetAllocationItem,
      minItems: 4,
      maxItems: 4,
    },
    timeline: {
      type: "array",
      items: timelineItem,
      minItems: 3,
      maxItems: 3,
    },
  },
  required: ["budgetAllocation", "timeline"],
} as const;

/** Segunda mitad del plan: síntesis, estética y recomendaciones. */
export const planCreativeResponseSchema = {
  type: "object",
  properties: {
    summary: { type: "string", maxLength: 220 },
    styleProposal: planResponseSchema.properties.styleProposal,
    recommendations: {
      ...planResponseSchema.properties.recommendations,
      minItems: 2,
      maxItems: 2,
    },
    warnings: {
      ...planResponseSchema.properties.warnings,
      maxItems: 1,
    },
  },
  required: ["summary", "styleProposal", "recommendations", "warnings"],
} as const;
