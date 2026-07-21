import Link from "next/link";
import { PartyPopper } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

/** Estado vacío reutilizable con un CTA opcional. */
export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
}: EmptyStateProps) {
  return (
    <div className="card flex flex-col items-center gap-4 py-12 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-rosa-claro text-rosa">
        <PartyPopper size={28} aria-hidden="true" />
      </span>
      <div>
        <h2 className="font-display text-xl font-bold text-ciruela">{title}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-texto/70">
          {description}
        </p>
      </div>
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className="btn-primary">
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
