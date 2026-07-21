"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  providerFormSchema,
  type ProviderFormInput,
} from "@/lib/validations/provider";
import {
  PROVIDER_CATEGORY_LABELS,
  PROVIDER_CATEGORY_OPTIONS,
  type Provider,
} from "@/types";

interface ProviderFormProps {
  initial?: Provider;
  onSubmit: (input: ProviderFormInput) => void;
  onCancel: () => void;
}

export function ProviderForm({
  initial,
  onSubmit,
  onCancel,
}: ProviderFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProviderFormInput>({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      name: initial?.name ?? "",
      category: initial?.category ?? "salones",
      department: initial?.department ?? "",
      city: initial?.city ?? "",
      priceFrom: initial?.priceFrom ?? 0,
      priceTo: initial?.priceTo ?? 0,
      currency: initial?.currency ?? "UYU",
      capacity: initial?.capacity,
      description: initial?.description ?? "",
      contact: initial?.contact ?? "",
      website: initial?.website ?? "",
      instagram: initial?.instagram ?? "",
      notes: initial?.notes ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="prov-name" className="field-label">
          Nombre
        </label>
        <input
          id="prov-name"
          type="text"
          className="field-input"
          {...register("name")}
        />
        {errors.name && <p className="field-error">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="prov-cat" className="field-label">
            Categoría
          </label>
          <select id="prov-cat" className="field-input" {...register("category")}>
            {PROVIDER_CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {PROVIDER_CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="prov-cur" className="field-label">
            Moneda
          </label>
          <select id="prov-cur" className="field-input" {...register("currency")}>
            <option value="UYU">UYU</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="prov-dep" className="field-label">
            Departamento
          </label>
          <input
            id="prov-dep"
            type="text"
            className="field-input"
            {...register("department")}
          />
          {errors.department && (
            <p className="field-error">{errors.department.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="prov-city" className="field-label">
            Ciudad
          </label>
          <input
            id="prov-city"
            type="text"
            className="field-input"
            {...register("city")}
          />
          {errors.city && <p className="field-error">{errors.city.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="prov-from" className="field-label">
            Precio desde
          </label>
          <input
            id="prov-from"
            type="number"
            min={0}
            className="field-input"
            {...register("priceFrom")}
          />
        </div>
        <div>
          <label htmlFor="prov-to" className="field-label">
            Precio hasta
          </label>
          <input
            id="prov-to"
            type="number"
            min={0}
            className="field-input"
            {...register("priceTo")}
          />
          {errors.priceTo && (
            <p className="field-error">{errors.priceTo.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="prov-cap" className="field-label">
          Capacidad (opcional)
        </label>
        <input
          id="prov-cap"
          type="number"
          min={0}
          className="field-input"
          placeholder="Solo salones / catering"
          {...register("capacity")}
        />
      </div>

      <div>
        <label htmlFor="prov-desc" className="field-label">
          Descripción (opcional)
        </label>
        <textarea
          id="prov-desc"
          rows={2}
          className="field-input resize-none"
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="prov-contact" className="field-label">
            Contacto
          </label>
          <input
            id="prov-contact"
            type="text"
            className="field-input"
            placeholder="Tel / email"
            {...register("contact")}
          />
        </div>
        <div>
          <label htmlFor="prov-ig" className="field-label">
            Instagram
          </label>
          <input
            id="prov-ig"
            type="text"
            className="field-input"
            placeholder="@usuario"
            {...register("instagram")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="prov-web" className="field-label">
          Sitio web (opcional)
        </label>
        <input
          id="prov-web"
          type="text"
          className="field-input"
          {...register("website")}
        />
      </div>

      <div>
        <label htmlFor="prov-notes" className="field-label">
          Notas (opcional)
        </label>
        <textarea
          id="prov-notes"
          rows={2}
          className="field-input resize-none"
          {...register("notes")}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          Guardar
        </button>
      </div>
    </form>
  );
}
