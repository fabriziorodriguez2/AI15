interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Acción opcional alineada a la derecha (ej: un botón). */
  action?: React.ReactNode;
}

/** Encabezado consistente para las páginas internas. */
export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-7 flex items-start justify-between gap-4 border-b border-[#eadfe5] pb-5">
      <div>
        <h1 className="font-display text-[26px] font-bold leading-tight text-ciruela">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-texto/65">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
