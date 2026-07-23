"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Pencil } from "lucide-react";
import {
  createEventSchema,
  type CreateEventInput,
} from "@/lib/validations/event";
import { useEventStore } from "@/store/event-store";
import { useHydratedEvent } from "@/store/use-hydrated-event";
import { StyleSelector } from "@/components/ui/StyleSelector";
import { URUGUAY_DEPARTMENTS, SUGGESTED_COLORS } from "@/data/departments";
import { cn } from "@/lib/utils/cn";

const STEPS = ["Tu fiesta", "Presupuesto", "Tu estilo"] as const;

const STEP_FIELDS: Array<Array<keyof CreateEventInput>> = [
  [
    "honoreeName",
    "eventDate",
    "city",
    "department",
    "guestCount",
    "confirmedGuestCount",
  ],
  ["totalBudget", "currency"],
  ["styles", "themeDescription", "favoriteColors"],
];

const EMPTY_DEFAULTS: Partial<CreateEventInput> = {
  honoreeName: "",
  eventDate: "",
  city: "",
  department: "",
  currency: "UYU",
  themeDescription: "",
  styles: [],
  favoriteColors: [],
  confirmedGuestCount: 0,
};

export function CreateEventForm() {
  const router = useRouter();
  const { event, ready } = useHydratedEvent();
  const createEvent = useEventStore((state) => state.createEvent);
  const updateEvent = useEventStore((state) => state.updateEvent);
  const [step, setStep] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const isEditing = !!event;
  const prefilledRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const stepLabelRef = useRef<HTMLParagraphElement>(null);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    mode: "onTouched",
    defaultValues: EMPTY_DEFAULTS,
  });

  // Precarga en modo edición, una sola vez, cuando el store se hidrata.
  useEffect(() => {
    if (!ready || prefilledRef.current) return;
    if (event) {
      reset({
        honoreeName: event.honoreeName,
        eventDate: event.eventDate,
        city: event.city,
        department: event.department,
        guestCount: event.guestCount,
        confirmedGuestCount: event.confirmedGuestCount,
        totalBudget: event.totalBudget,
        currency: event.currency,
        styles: event.styles,
        themeDescription: event.themeDescription,
        favoriteColors: event.favoriteColors,
      });
    }
    prefilledRef.current = true;
  }, [ready, event, reset]);

  // El marco mobile usa un scroll interno. Al cambiar de paso lo reiniciamos
  // para que el contenido nuevo (especialmente "Tu estilo") siempre quede
  // visible desde arriba, en vez de conservar la posición del paso anterior.
  useEffect(() => {
    const scrollContainer = formRef.current?.closest<HTMLElement>(
      "[data-create-event-scroll]",
    );
    scrollContainer?.scrollTo({ top: 0, behavior: "auto" });
    stepLabelRef.current?.focus({ preventScroll: true });
  }, [step]);

  const goNext = async () => {
    if (isAdvancing) return;
    setIsAdvancing(true);
    try {
      const valid = await trigger(STEP_FIELDS[step]);
      if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
    } finally {
      setIsAdvancing(false);
    }
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = (data: CreateEventInput) => {
    if (isEditing) {
      updateEvent(data);
      router.push("/cuenta");
    } else {
      createEvent(data);
      router.push("/dashboard");
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Nunca guardamos mediante el submit implícito del navegador. Esto evita
    // que el mismo clic que abre el paso 3 se reutilice sobre el botón final.
    event.preventDefault();
    if (step < STEPS.length - 1) {
      void goNext();
    }
  };

  return (
    <form ref={formRef} onSubmit={handleFormSubmit} noValidate>
      {isEditing && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-dorado/40 bg-dorado/10 px-4 py-2.5 text-sm text-ciruela">
          <Pencil size={15} aria-hidden="true" />
          Estás editando tu fiesta. Tus gastos, tareas y decisiones se conservan.
        </div>
      )}

      {/* Indicador de pasos */}
      <div className="mb-6">
        <ol
          className="flex items-center gap-2"
          aria-label="Progreso del formulario"
        >
          {STEPS.map((label, index) => {
            const done = index < step;
            const current = index === step;
            return (
              <li key={label} className="flex flex-1 items-center gap-2">
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold transition",
                    done && "bg-dorado text-white",
                    current && "bg-rosa text-white",
                    !done && !current && "bg-rosa-claro text-ciruela",
                  )}
                  aria-current={current ? "step" : undefined}
                >
                  {done ? <Check size={15} aria-hidden="true" /> : index + 1}
                </span>
                {index < STEPS.length - 1 && (
                  <span className="h-px flex-1 bg-rosa-claro" />
                )}
              </li>
            );
          })}
        </ol>
        <p
          ref={stepLabelRef}
          tabIndex={-1}
          className="mt-3 text-sm font-semibold text-ciruela outline-none"
        >
          Paso {step + 1} de {STEPS.length} · {STEPS[step]}
        </p>
      </div>

      <div className="rounded-xl border border-[#eadfe5] bg-white p-5 shadow-card">
        {/* Paso 1 */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label htmlFor="honoreeName" className="field-label">
                Nombre o apodo de la quinceañera
              </label>
              <input
                id="honoreeName"
                type="text"
                className="field-input"
                placeholder="Ej: Sofi"
                aria-invalid={!!errors.honoreeName}
                {...register("honoreeName")}
              />
              {errors.honoreeName && (
                <p className="field-error">{errors.honoreeName.message}</p>
              )}
            </div>

            <div className="grid gap-5">
              <div>
                <label htmlFor="eventDate" className="field-label">
                  Fecha del evento
                </label>
                <input
                  id="eventDate"
                  type="date"
                  className="field-input"
                  aria-invalid={!!errors.eventDate}
                  {...register("eventDate")}
                />
                {errors.eventDate && (
                  <p className="field-error">{errors.eventDate.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="guestCount" className="field-label">
                  Invitados estimados
                </label>
                <input
                  id="guestCount"
                  type="number"
                  min={20}
                  max={500}
                  className="field-input"
                  placeholder="Ej: 150"
                  aria-invalid={!!errors.guestCount}
                  {...register("guestCount")}
                />
                {errors.guestCount && (
                  <p className="field-error">{errors.guestCount.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmedGuestCount" className="field-label">
                  Invitados confirmados (opcional)
                </label>
                <input
                  id="confirmedGuestCount"
                  type="number"
                  min={0}
                  max={500}
                  className="field-input"
                  placeholder="Ej: 0"
                  aria-invalid={!!errors.confirmedGuestCount}
                  {...register("confirmedGuestCount")}
                />
                {errors.confirmedGuestCount && (
                  <p className="field-error">
                    {errors.confirmedGuestCount.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-5">
              <div>
                <label htmlFor="department" className="field-label">
                  Departamento
                </label>
                <select
                  id="department"
                  className="field-input"
                  aria-invalid={!!errors.department}
                  defaultValue=""
                  {...register("department")}
                >
                  <option value="" disabled>
                    Elegí un departamento
                  </option>
                  {URUGUAY_DEPARTMENTS.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="field-error">{errors.department.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="field-label">
                  Ciudad
                </label>
                <input
                  id="city"
                  type="text"
                  className="field-input"
                  placeholder="Ej: Montevideo"
                  aria-invalid={!!errors.city}
                  {...register("city")}
                />
                {errors.city && (
                  <p className="field-error">{errors.city.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Paso 2 */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label htmlFor="totalBudget" className="field-label">
                Presupuesto total
              </label>
              <input
                id="totalBudget"
                type="number"
                min={1}
                className="field-input"
                placeholder="Ej: 350000"
                aria-invalid={!!errors.totalBudget}
                {...register("totalBudget")}
              />
              {errors.totalBudget && (
                <p className="field-error">{errors.totalBudget.message}</p>
              )}
            </div>

            <div>
              <span className="field-label">Moneda</span>
              <div className="flex gap-3">
                {(["UYU", "USD"] as const).map((cur) => (
                  <label
                    key={cur}
                    className="flex min-h-12 flex-1 cursor-pointer items-center gap-2 rounded-xl border border-[#dfd3da] bg-white px-4 py-3 text-sm font-medium text-ciruela transition has-[:checked]:border-rosa has-[:checked]:bg-rosa-claro/30"
                  >
                    <input
                      type="radio"
                      value={cur}
                      className="accent-rosa"
                      {...register("currency")}
                    />
                    {cur === "UYU" ? "Pesos uruguayos (UYU)" : "Dólares (USD)"}
                  </label>
                ))}
              </div>
              {errors.currency && (
                <p className="field-error">{errors.currency.message}</p>
              )}
            </div>

            <p className="rounded-xl bg-rosa-fondo p-4 text-xs text-texto/60">
              Este presupuesto es la base. En Presupuesto podés registrar tus
              gastos reales y AI15 puede proponerte una distribución.
            </p>
          </div>
        )}

        {/* Paso 3 */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label htmlFor="themeDescription" className="field-label">
                Temática o descripción libre (opcional)
              </label>
              <textarea
                id="themeDescription"
                rows={3}
                className="field-input resize-none"
                placeholder="Ej: una noche elegante con toques románticos y luces cálidas."
                {...register("themeDescription")}
              />
              {errors.themeDescription && (
                <p className="field-error">
                  {errors.themeDescription.message}
                </p>
              )}
            </div>

            <div>
              <span className="field-label">Elegí uno o más estilos</span>
              <Controller
                control={control}
                name="styles"
                render={({ field }) => (
                  <StyleSelector value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.styles && (
                <p className="field-error">{errors.styles.message as string}</p>
              )}
            </div>

            <div>
              <span className="field-label">Colores favoritos (opcional)</span>
              <Controller
                control={control}
                name="favoriteColors"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_COLORS.map((color) => {
                      const selected = field.value.includes(color.value);
                      return (
                        <button
                          key={color.value}
                          type="button"
                          aria-pressed={selected}
                          aria-label={color.label}
                          title={color.label}
                          onClick={() =>
                            field.onChange(
                              selected
                                ? field.value.filter(
                                    (c: string) => c !== color.value,
                                  )
                                : [...field.value, color.value],
                            )
                          }
                          className={cn(
                            "grid size-9 place-items-center rounded-full border-2 transition",
                            selected
                              ? "border-ciruela"
                              : "border-transparent hover:border-rosa-claro",
                          )}
                          style={{ backgroundColor: color.value }}
                        >
                          {selected && (
                            <Check
                              size={15}
                              className="text-white mix-blend-difference"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {/* Navegación entre pasos */}
        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <button type="button" onClick={goBack} className="btn-secondary">
              <ArrowLeft size={16} aria-hidden="true" />
              Atrás
            </button>
          ) : isEditing ? (
            <button
              type="button"
              onClick={() => router.push("/cuenta")}
              className="btn-secondary"
            >
              Cancelar
            </button>
          ) : (
            <span />
          )}

          {step < STEPS.length - 1 ? (
            <button
              key="continue-event"
              type="button"
              onClick={goNext}
              disabled={isAdvancing}
              className="btn-primary"
            >
              Continuar
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <button
              key="save-event"
              type="button"
              onClick={() => void handleSubmit(onSubmit)()}
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isEditing ? "Guardar cambios" : "Crear mi fiesta"}
              <Check size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
