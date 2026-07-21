# AI15 — Planificador inteligente de fiestas de 15

**Planificá tu fiesta de 15 en un solo lugar.**

AI15 es una aplicación web pensada para quinceañeras y familias de Uruguay que
necesitan organizar una fiesta de 15. Centraliza los datos del evento, el
presupuesto, los invitados, los proveedores, las inspiraciones y el cronograma,
y está preparada para incorporar recomendaciones personalizadas mediante
inteligencia artificial en próximas etapas.

## Alcance de esta primera etapa

Esta etapa entrega una **base sólida y funcional**, con datos ficticios
claramente identificados y la infraestructura preparada para conectar la IA
más adelante. **Incluye:**

- Landing de bienvenida con demo cargable.
- Creación de evento en un formulario de 3 pasos (validado con Zod).
- Persistencia temporal del evento en `localStorage` (Zustand persist).
- Dashboard con datos reales del evento y métricas de demostración.
- Presupuesto con distribución de referencia y gráfico circular (CSS puro).
- Catálogo de proveedores ficticios con filtros y búsqueda.
- Pantalla de inspiración con carga y previsualización local de imágenes.
- Cronograma con fechas calculadas a partir de la fecha de la fiesta.
- Pantalla de cuenta con edición y borrado de datos locales.
- Cliente de Gemini **solo servidor** listo para integrarse (sin llamadas aún).

**No incluye todavía** (etapas futuras): autenticación real, Supabase/base de
datos externa, pagos, proveedores desde APIs reales, análisis real de imágenes,
generación real del plan con IA, automatizaciones ni panel administrativo.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- TypeScript (modo estricto)
- Tailwind CSS
- React Hook Form + Zod + `@hookform/resolvers`
- Zustand (con `persist`)
- Lucide React (iconos)
- `next/font` (Poppins + Playfair Display)
- ESLint

## Requisitos

- Node.js 18.18+ (recomendado 20 o 22)
- npm 9+

## Instalación

```bash
npm install
```

## Variables de entorno

Copiá el archivo de ejemplo y completá los valores:

```bash
cp .env.example .env.local
```

| Variable                | Descripción                                  |
| ----------------------- | -------------------------------------------- |
| `GEMINI_PROXY_API_KEY`  | Clave del proxy de Gemini (solo servidor).   |
| `GEMINI_PROXY_BASE_URL` | URL base del proxy.                          |
| `GEMINI_TEXT_MODEL`     | Modelo de texto por defecto.                 |

> `.env.local` está ignorado por Git. La API key **nunca** usa el prefijo
> `NEXT_PUBLIC_` y no se expone al navegador.

## Comandos disponibles

```bash
npm run dev     # Inicia el servidor de desarrollo (http://localhost:3000)
npm run build   # Compila la aplicación para producción
npm run start   # Sirve la build de producción
npm run lint    # Ejecuta ESLint
```

## Cómo cargar el evento demo

En la landing (`/`), tocá **"Ver demo"**. Esto carga un evento ficticio en el
store y te lleva al dashboard. También podés crear tu propio evento desde
**"Crear mi fiesta"**.

## Arquitectura resumida

```
src/
  app/
    page.tsx                  # Landing
    crear-evento/             # Formulario de 3 pasos
    (planner)/                # Layout con sidebar + nav mobile
      dashboard, presupuesto, proveedores,
      inspiracion, cronograma, cuenta
  components/                 # brand, layout, ui, budget, providers, timeline, inspiration
  data/                       # Datos mock (proveedores, presupuesto, cronograma, etc.)
  lib/
    ai/gemini-proxy.ts        # Cliente de IA (solo servidor)
    utils/                    # Moneda, fechas, cronograma, cn
    validations/              # Esquemas Zod
  store/                      # Zustand (evento) + hook SSR-safe
  types/                      # Tipos del dominio
docs/                         # Brief y registro de decisiones
```

- El estado del evento vive en un único store de Zustand con `persist`. Ningún
  componente accede directo a `localStorage`.
- La lectura del evento se hace con `useHydratedEvent` para evitar errores de
  hidratación entre servidor y cliente.
- Los datos ficticios están separados en `src/data/` y marcados como demo.

## Estado actual de la integración con IA

El cliente de Gemini existe en `src/lib/ai/gemini-proxy.ts`, importa
`server-only`, lee la key de variables de entorno, maneja timeout con
`AbortController` y errores sin filtrar información sensible. **No se ejecuta
ninguna llamada todavía**: la infraestructura está lista para conectarse.
Los puntos de integración están marcados con comentarios `TODO(ia)`.

## Próximas etapas

1. Generación del plan personalizado con IA.
2. Distribución inteligente del presupuesto.
3. Análisis de inspiración (imágenes de vestidos/decoración).
4. Memoria de decisiones para mantener coherencia entre elecciones.
5. Autenticación y persistencia en la nube.
6. Proveedores reales.

## Medidas tomadas para proteger la API key

- El cliente de IA importa `server-only`: no puede ejecutarse en el navegador.
- La key se lee de variables de entorno del servidor, sin prefijo
  `NEXT_PUBLIC_`.
- La key nunca se registra en logs ni se envía al cliente.
- Los errores del proxy se traducen a mensajes genéricos para la usuaria.
- `.env.local` está en `.gitignore`.
