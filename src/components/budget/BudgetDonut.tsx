import type { BudgetCategory } from "@/data/budget";

interface BudgetDonutProps {
  categories: BudgetCategory[];
  size?: number;
}

/**
 * Gráfico circular (donut) construido con CSS conic-gradient.
 * No usa ninguna librería de gráficos.
 */
export function BudgetDonut({ categories, size = 200 }: BudgetDonutProps) {
  let cursor = 0;
  const segments = categories.map((cat) => {
    const start = cursor;
    const end = cursor + cat.percent;
    cursor = end;
    return `${cat.color} ${start}% ${end}%`;
  });

  const gradient = `conic-gradient(${segments.join(", ")})`;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label="Distribución del presupuesto por categoría"
    >
      <div
        className="size-full rounded-full"
        style={{ background: gradient }}
      />
      <div
        className="absolute grid place-items-center rounded-full bg-white text-center shadow-soft"
        style={{
          inset: size * 0.22,
        }}
      >
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-texto/50">
            Categorías
          </p>
          <p className="font-display text-2xl font-bold text-ciruela">
            {categories.length}
          </p>
        </div>
      </div>
    </div>
  );
}
