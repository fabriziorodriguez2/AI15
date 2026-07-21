import { MapPin, Star, Users } from "lucide-react";
import type { Provider } from "@/types";
import { PROVIDER_CATEGORY_LABELS } from "@/types";
import { formatCurrency } from "@/lib/utils/currency";

/** Tarjeta de un proveedor del catálogo (datos ficticios). */
export function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-[#eadfe5] bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="chip mb-1.5">
            {PROVIDER_CATEGORY_LABELS[provider.category]}
          </span>
          <h3 className="font-display text-lg font-bold text-ciruela">
            {provider.name}
          </h3>
        </div>
        {provider.rating !== undefined && (
          <span className="inline-flex items-center gap-1 rounded-md bg-dorado/10 px-2 py-1 text-xs font-semibold text-[#8f7420]">
            <Star size={13} fill="currentColor" aria-hidden="true" />
            {provider.rating.toFixed(1)}
          </span>
        )}
      </div>

      <p className="text-sm text-texto/70">{provider.description}</p>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-texto/60">
        <span className="inline-flex items-center gap-1">
          <MapPin size={13} aria-hidden="true" />
          {provider.city}, {provider.department}
        </span>
        {provider.capacity && (
          <span className="inline-flex items-center gap-1">
            <Users size={13} aria-hidden="true" />
            Hasta {provider.capacity} invitados
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {provider.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-rosa-fondo px-2 py-0.5 text-[11px] text-ciruela"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-rosa-claro pt-3">
        <span className="text-sm font-semibold text-ciruela">
          {formatCurrency(provider.priceFrom, provider.currency)} –{" "}
          {formatCurrency(provider.priceTo, provider.currency)}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-dorado">
          Demo
        </span>
      </div>
    </article>
  );
}
