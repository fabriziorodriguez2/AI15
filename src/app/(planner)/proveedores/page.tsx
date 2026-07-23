"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, MapPin, Heart } from "lucide-react";
import { useEventStore } from "@/store/event-store";
import { useStoreReady } from "@/store/use-hydrated-event";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ProviderForm } from "@/components/providers/ProviderForm";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { MockBadge } from "@/components/ui/MockBadge";
import { MOCK_PROVIDERS } from "@/data/providers";
import {
  PROVIDER_CATEGORY_LABELS,
  SELECTED_PROVIDER_STATUS_LABELS,
  type Provider,
  type ProviderCategory,
  type SelectedProviderStatus,
} from "@/types";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

type Tab = "mios" | "demo";
type PriceFilter = "todos" | "bajo" | "medio" | "alto";

const PRICE_LABELS: Record<PriceFilter, string> = {
  todos: "Cualquier precio",
  bajo: "Económico",
  medio: "Intermedio",
  alto: "Premium",
};

function matchesPrice(priceTo: number, filter: PriceFilter): boolean {
  if (filter === "todos") return true;
  if (filter === "bajo") return priceTo <= 30000;
  if (filter === "medio") return priceTo > 30000 && priceTo <= 80000;
  return priceTo > 80000;
}

// La demo muestra un ejemplo por categoría para que el catálogo sea breve.
const DEMO_PROVIDERS = MOCK_PROVIDERS.filter(
  (provider, index, all) =>
    all.findIndex((item) => item.category === provider.category) === index,
);

const DEMO_DEPARTMENTS = Array.from(
  new Set(DEMO_PROVIDERS.map((p) => p.department)),
).sort();

export default function ProveedoresPage() {
  const ready = useStoreReady();
  const event = useEventStore((s) => s.event);
  const providers = useEventStore((s) => s.providers);
  const selectedProviders = useEventStore((s) => s.selectedProviders);
  const addProvider = useEventStore((s) => s.addProvider);
  const updateProvider = useEventStore((s) => s.updateProvider);
  const deleteProvider = useEventStore((s) => s.deleteProvider);
  const selectProvider = useEventStore((s) => s.selectProvider);
  const unselectProvider = useEventStore((s) => s.unselectProvider);
  const updateSelectedProvider = useEventStore((s) => s.updateSelectedProvider);

  const [tab, setTab] = useState<Tab>("mios");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Provider | null>(null);
  const [toDelete, setToDelete] = useState<Provider | null>(null);

  const [myQuery, setMyQuery] = useState("");
  const [myCategory, setMyCategory] = useState<ProviderCategory | "todas">(
    "todas",
  );

  // Filtros del catálogo demo.
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProviderCategory | "todas">("todas");
  const [department, setDepartment] = useState("todos");
  const [price, setPrice] = useState<PriceFilter>("todos");

  const selectedByProviderId = useMemo(() => {
    const map = new Map<string, (typeof selectedProviders)[number]>();
    for (const s of selectedProviders) map.set(s.providerId, s);
    return map;
  }, [selectedProviders]);

  const myFiltered = useMemo(() => {
    const normalizedQuery = myQuery.trim().toLocaleLowerCase("es");
    return providers
      .filter((provider) => {
        const matchesName = provider.name
          .toLocaleLowerCase("es")
          .includes(normalizedQuery);
        const matchesCategory =
          myCategory === "todas" || provider.category === myCategory;
        return matchesName && matchesCategory;
      })
      .sort((a, b) =>
        a.name.localeCompare(b.name, "es", { sensitivity: "base" }),
      );
  }, [providers, myCategory, myQuery]);

  const demoFiltered = useMemo(() => {
    return DEMO_PROVIDERS.filter((p) => {
      if (category !== "todas" && p.category !== category) return false;
      if (department !== "todos" && p.department !== department) return false;
      if (!matchesPrice(p.priceTo, price)) return false;
      if (
        query.trim() &&
        !p.name.toLowerCase().includes(query.trim().toLowerCase())
      )
        return false;
      return true;
    }).sort((a, b) =>
      a.name.localeCompare(b.name, "es", { sensitivity: "base" }),
    );
  }, [category, department, price, query]);

  if (!ready) return <div className="h-40" aria-hidden="true" />;

  if (!event) {
    return (
      <EmptyState
        title="Sin proveedores todavía"
        description="Creá tu fiesta para cargar y comparar proveedores."
        ctaLabel="Crear mi fiesta"
        ctaHref="/crear-evento"
      />
    );
  }

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Proveedores"
        subtitle="Cargá tus proveedores reales o explorá ejemplos."
        action={
          tab === "mios" ? (
            <button onClick={openNew} className="btn-primary px-4 py-2 text-xs">
              <Plus size={15} aria-hidden="true" />
              Nuevo
            </button>
          ) : undefined
        }
      />

      {/* Tabs */}
      <div className="mb-5 flex gap-2">
        {(
          [
            ["mios", "Mis proveedores"],
            ["demo", "Ejemplos"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            aria-pressed={tab === key}
            className={cn(
              "min-h-11 flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition",
              tab === key
                ? "border-rosa bg-rosa text-white"
                : "border-rosa-claro bg-white text-ciruela hover:bg-rosa-claro/40",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "mios" ? (
        providers.length === 0 ? (
          <div className="surface-section px-5 text-center">
            <p className="text-sm text-texto/60">
              Todavía no cargaste proveedores. Agregá los tuyos con sus datos
              reales para compararlos y seleccionarlos.
            </p>
            <button onClick={openNew} className="btn-primary mt-4">
              <Plus size={16} aria-hidden="true" />
              Agregar proveedor
            </button>
          </div>
        ) : (
          <>
            <div className="card mb-4 grid grid-cols-1 gap-3">
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-texto/40"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={myQuery}
                  onChange={(e) => setMyQuery(e.target.value)}
                  placeholder="Buscar por nombre"
                  aria-label="Buscar proveedor por nombre"
                  className="field-input pl-9"
                />
              </div>
              <select
                aria-label="Filtrar proveedores por categoría"
                className="field-input"
                value={myCategory}
                onChange={(e) =>
                  setMyCategory(e.target.value as ProviderCategory | "todas")
                }
              >
                <option value="todas">Todas las categorías</option>
                {(
                  Object.keys(PROVIDER_CATEGORY_LABELS) as ProviderCategory[]
                ).map((cat) => (
                  <option key={cat} value={cat}>
                    {PROVIDER_CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>

            {myFiltered.length === 0 ? (
              <div className="card py-8 text-center text-sm text-texto/60">
                No hay proveedores con esos filtros.
              </div>
            ) : (
          <ul className="grid gap-3">
            {myFiltered.map((provider) => {
              const selected = selectedByProviderId.get(provider.id);
              return (
                <li key={provider.id} className="rounded-xl border border-[#eadfe5] bg-white p-5 shadow-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="chip mb-1.5">
                        {PROVIDER_CATEGORY_LABELS[provider.category]}
                      </span>
                      <h3 className="font-display text-lg font-bold text-ciruela">
                        {provider.name}
                      </h3>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => {
                          setEditing(provider);
                          setFormOpen(true);
                        }}
                        aria-label="Editar proveedor"
                        className="grid size-11 place-items-center rounded-lg text-texto/50 hover:bg-rosa-fondo hover:text-ciruela"
                      >
                        <Pencil size={15} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => setToDelete(provider)}
                        aria-label="Eliminar proveedor"
                        className="grid size-11 place-items-center rounded-lg text-texto/50 hover:bg-[#c0392b]/10 hover:text-[#c0392b]"
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {provider.description && (
                    <p className="mt-2 text-sm text-texto/70">
                      {provider.description}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-texto/60">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={13} aria-hidden="true" />
                      {provider.city}, {provider.department}
                    </span>
                    {(provider.priceFrom > 0 || provider.priceTo > 0) && (
                      <span>
                        {formatCurrency(provider.priceFrom, provider.currency)} –{" "}
                        {formatCurrency(provider.priceTo, provider.currency)}
                      </span>
                    )}
                    {provider.contact && <span>{provider.contact}</span>}
                    {provider.instagram && <span>{provider.instagram}</span>}
                  </div>

                  {/* Selección */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-rosa-claro pt-3">
                    {selected ? (
                      <>
                        <select
                          aria-label="Estado del proveedor"
                          value={selected.status}
                          onChange={(e) =>
                            updateSelectedProvider(selected.id, {
                              status: e.target.value as SelectedProviderStatus,
                            })
                          }
                          className="min-h-11 rounded-xl border border-[#dfd3da] bg-white px-3 py-1.5 text-xs font-medium text-ciruela"
                        >
                          {(
                            Object.keys(
                              SELECTED_PROVIDER_STATUS_LABELS,
                            ) as SelectedProviderStatus[]
                          ).map((st) => (
                            <option key={st} value={st}>
                              {SELECTED_PROVIDER_STATUS_LABELS[st]}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => unselectProvider(selected.id)}
                          className="text-xs font-medium text-texto/50 hover:text-[#c0392b]"
                        >
                          Quitar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          selectProvider(provider.id, provider.category)
                        }
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-rosa-claro px-3 py-1.5 text-xs font-semibold text-rosa hover:bg-rosa/20"
                      >
                        <Heart size={13} aria-hidden="true" />
                        Seleccionar
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
            )}
          </>
        )
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="text-xs text-texto/60">
              Ejemplos para inspirarte. No son negocios reales.
            </p>
            <MockBadge />
          </div>

          {/* Filtros demo */}
          <div className="card mb-4 space-y-3">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-texto/40"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre"
                aria-label="Buscar proveedor de demostración"
                className="field-input pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select
                aria-label="Categoría"
                className="field-input"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as ProviderCategory | "todas")
                }
              >
                <option value="todas">Todas las categorías</option>
                {(
                  Object.keys(PROVIDER_CATEGORY_LABELS) as ProviderCategory[]
                ).map((cat) => (
                  <option key={cat} value={cat}>
                    {PROVIDER_CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
              <select
                aria-label="Ubicación"
                className="field-input"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="todos">Toda ubicación</option>
                {DEMO_DEPARTMENTS.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
              <select
                aria-label="Precio"
                className="field-input col-span-2"
                value={price}
                onChange={(e) => setPrice(e.target.value as PriceFilter)}
              >
                {(Object.keys(PRICE_LABELS) as PriceFilter[]).map((key) => (
                  <option key={key} value={key}>
                    {PRICE_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {demoFiltered.length === 0 ? (
            <div className="card py-8 text-center text-sm text-texto/60">
              No hay ejemplos con esos filtros.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {demoFiltered.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}
        </div>
      )}

      <Modal
        open={formOpen}
        title={editing ? "Editar proveedor" : "Nuevo proveedor"}
        onClose={() => setFormOpen(false)}
      >
        <ProviderForm
          initial={editing ?? undefined}
          onCancel={() => setFormOpen(false)}
          onSubmit={(input) => {
            if (editing) updateProvider(editing.id, input);
            else addProvider(input);
            setFormOpen(false);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="¿Eliminar proveedor?"
        description="También se quitará de tus seleccionados. Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteProvider(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
