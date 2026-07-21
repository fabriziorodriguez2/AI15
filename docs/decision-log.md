# AI15 — Registro de decisiones

Decisiones técnicas iniciales de la primera etapa.

## 1. Next.js con App Router

**Decisión:** usar Next.js 14 con App Router y estructura `src/`.
**Motivo:** permite combinar renderizado en servidor y cliente, facilita separar
código exclusivo del servidor (clave para proteger la API key con
`server-only`), y ofrece buenas herramientas de build y lint listas para usar.

## 2. localStorage temporal vía Zustand persist

**Decisión:** guardar el evento en `localStorage` mediante un único store de
Zustand con el middleware `persist`.
**Motivo:** en esta etapa no hay autenticación ni base de datos. Zustand centraliza
el estado, evita accesos dispersos a `localStorage` y facilita migrar a una API
más adelante. Se agregó un flag `hasHydrated` y el hook `useHydratedEvent` para
prevenir errores de hidratación entre servidor y cliente.

## 3. Cliente de IA separado en el servidor

**Decisión:** aislar el cliente de Gemini en `src/lib/ai/gemini-proxy.ts` con
`import "server-only"`.
**Motivo:** garantiza que la API key nunca llegue al navegador. La key se lee de
variables de entorno sin prefijo `NEXT_PUBLIC_`, no se registra en logs y los
errores se traducen a mensajes genéricos. No se ejecuta ninguna llamada durante
el build.

## 4. Datos ficticios para proveedores

**Decisión:** usar proveedores ficticios (con `isMock: true`) en `src/data/`, sin
nombres de negocios reales.
**Motivo:** todavía no hay integración con APIs ni datos reales. Marcarlos como
demo evita presentar información engañosa y mantiene la separación entre datos y
componentes. Se muestra una etiqueta "Datos de demostración" en la interfaz.

## 5. No implementar análisis visual todavía

**Decisión:** la pantalla de inspiración permite seleccionar y previsualizar una
imagen localmente, pero el botón "Analizar con IA" está deshabilitado.
**Motivo:** no existe todavía un formato documentado de análisis ni una conexión
real. Inventar un resultado sería engañoso. La imagen no se envía a ningún
servicio y se incluye una nota de privacidad.

## 6. Gráficos con CSS puro

**Decisión:** el gráfico de presupuesto se construye con `conic-gradient` en vez
de una librería de gráficos.
**Motivo:** evita agregar una dependencia pesada para una necesidad simple.

## 7. Sin librería de clases utilitarias externa

**Decisión:** helper `cn` propio en vez de `clsx`/`tailwind-merge`.
**Motivo:** la necesidad es mínima y se resuelve con una función pequeña.

## 8. Cálculo de fechas seguro

**Decisión:** utilidades propias `subtractMonths` / `subtractDays` con manejo de
desbordes de día.
**Motivo:** evitar dependencias de manejo de fechas y prevenir bugs al restar
meses (ej: 31 → febrero). Las fechas del cronograma se calculan siempre desde la
fecha real del evento.
