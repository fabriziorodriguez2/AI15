interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Acción opcional alineada a la derecha (ej: un botón). */
  action?: React.ReactNode;
}

/** Encabezado consistente para las páginas internas. */
export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-bold text-ciruela">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-texto/70">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
