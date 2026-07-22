# AI15 — Planificador inteligente de fiestas de 15

**Planificá tu fiesta de 15 en un solo lugar.**

AI15 es una aplicación web pensada para quinceañeras y familias de Uruguay que
necesitan organizar una fiesta de 15. Centraliza los datos del evento, el
presupuesto, los invitados, los proveedores, las inspiraciones y el cronograma,
y genera recomendaciones personalizadas mediante inteligencia artificial.

## Alcance de esta primera etapa

Esta etapa entrega un **MVP funcional**, con datos ficticios claramente
identificados e inteligencia artificial integrada. **Incluye:**

- Landing de bienvenida con demo cargable.
- Creación de evento en un formulario de 3 pasos (validado con Zod).
- Usuario demo hardcodeado y estado temporal de sesión con Zustand.
- Dashboard con datos reales del evento y métricas de demostración.
- Presupuesto con distribución de referencia y gráfico circular (CSS puro).
- Catálogo de proveedores ficticios hardcodeados con filtros y búsqueda.
- Pantalla de inspiración con carga y previsualización local de imágenes.
- Cronograma con fechas calculadas a partir de la fecha de la fiesta.
- Pantalla de cuenta con identificación del usuario demo y restauración.
- Generación real de un plan personalizado mediante Gemini.
- Distribución inteligente del presupuesto mediante Gemini.

**No incluye todavía** (etapas futuras): autenticación real, Supabase/base de
datos externa, pagos, proveedores desde APIs reales, análisis real de imágenes,
automatizaciones externas ni panel administrativo.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- TypeScript (modo estricto)
- Tailwind CSS
- React Hook Form + Zod + `@hookform/resolvers`
- Zustand
- Lucide React (iconos)
- `next/font` (Poppins + Playfair Display)
- ESLint

## Requisitos

- [Node.js](https://nodejs.org/) 18.18 o superior. Se recomienda Node 20 o 22.
- npm 9 o superior, incluido con Node.js.
- Una clave válida del proxy estudiantil de Gemini para utilizar las funciones
  de IA. El resto de la aplicación puede abrirse sin la clave.
- No se necesita una base de datos, Docker, Google Places ni credenciales de
  usuario.

Comprobá las versiones instaladas:

```powershell
node --version
npm --version
```

## Guía completa para levantar el proyecto

### 1. Abrir una terminal en la carpeta del proyecto

En Windows PowerShell:

```powershell
cd "C:\Users\fabri\OneDrive\Desktop\AI15\AI15"
```

Si el repositorio se descargó en otra ubicación, sustituí esa ruta por la
carpeta que contiene `package.json`.

### 2. Instalar las dependencias

El repositorio incluye `package-lock.json`; por eso se recomienda una
instalación reproducible con:

```powershell
npm ci
```

Para una instalación de desarrollo que permita actualizar el lockfile también
puede utilizarse `npm install`.

### 3. Crear el archivo de configuración local

En Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

En macOS o Linux:

```bash
cp .env.example .env.local
```

Abrí `.env.local` y completá estas variables:

```dotenv
GEMINI_PROXY_API_KEY=PEGAR_LA_CLAVE_ENTREGADA_POR_EL_CURSO
GEMINI_PROXY_BASE_URL=https://gemini-vertex-student-proxy.vercel.app
GEMINI_TEXT_MODEL=gemini-2.5-flash
```

| Variable                | Descripción                                  |
| ----------------------- | -------------------------------------------- |
| `GEMINI_PROXY_API_KEY`  | Clave entregada para autenticar el proxy. Es obligatoria para usar la IA. |
| `GEMINI_PROXY_BASE_URL` | URL base del proxy estudiantil. El valor de `.env.example` ya es el correcto. |
| `GEMINI_TEXT_MODEL`     | Modelo de texto. El proyecto utiliza `gemini-2.5-flash`. |

La clave debe obtenerse del docente o responsable del proxy. No es una
contraseña de la cuenta demo. `.env.local` está ignorado por Git: no hay que
subirlo, adjuntarlo ni copiar la clave dentro del código. La variable tampoco
debe llevar el prefijo `NEXT_PUBLIC_`, porque eso la expondría al navegador.

Si se cambia `.env.local` mientras el servidor está abierto, hay que detenerlo
y volver a iniciarlo para que Next.js lea los nuevos valores.

### 4. Iniciar la aplicación en desarrollo

```powershell
npm run dev
```

Cuando la terminal muestre `Ready`, abrir:

<http://localhost:3000>

La terminal debe permanecer abierta mientras se utiliza la aplicación. Para
detener el servidor, presionar `Ctrl + C`.

Si el puerto 3000 está ocupado, puede utilizarse otro:

```powershell
npm run dev -- -p 3001
```

En ese caso la dirección será <http://localhost:3001>.

### 5. Entrar y cargar los datos de prueba

No existe login ni contraseña. La aplicación usa este perfil hardcodeado:

| Campo | Valor |
| ----- | ----- |
| Nombre | Sofi |
| Correo | `sofi@ai15.demo` |
| Rol | Quinceañera |

En la portada, avanzar por el onboarding y tocar **Ver demo**. Esto carga el
evento, presupuesto, cronograma y demás datos de ejemplo. El estado vive en
memoria: los cambios de la sesión se restauran al recargar la página.

### 6. Comprobar que todo funciona

Realizar este recorrido:

1. Abrir el dashboard y verificar que aparezca el evento demo.
2. Ir a **Presupuesto** y tocar **Generar distribución con IA**.
3. Ir a **Plan** y tocar **Generar mi plan con AI15**.
4. Comprobar que el plan muestre presupuesto, tareas y recomendaciones.
5. Ir a **Proveedores > Ejemplos** y probar los filtros del catálogo
   hardcodeado.
6. Agregar un gasto o una tarea y comprobar que la interfaz se actualice.

Las generaciones de IA pueden demorar varios segundos. Si las pantallas
normales funcionan pero las dos acciones de IA fallan, revisar primero la
clave y reiniciar el servidor.

### 7. Validar el proyecto antes de entregar

Ejecutar cada comando desde la carpeta que contiene `package.json`:

```powershell
npx tsc --noEmit
npm run lint
npm run build
```

Los tres deben finalizar sin errores. `npm run build` genera la carpeta `.next`.

### 8. Levantar la versión de producción local

Primero debe existir una build correcta:

```powershell
npm run build
npm run start
```

Abrir nuevamente <http://localhost:3000>. `npm run start` no reemplaza a
`npm run build`: siempre necesita que la compilación se haya ejecutado antes.

## Comandos disponibles

| Comando | Función |
| ------- | ------- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npx tsc --noEmit` | Verifica los tipos sin generar archivos. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run build` | Compila y optimiza la aplicación. |
| `npm run start` | Sirve la build de producción existente. |

## Problemas frecuentes

### `npm` o `node` no se reconoce como comando

Node.js no está instalado o la terminal todavía no actualizó el `PATH`.
Instalar Node 20/22 y abrir una terminal nueva.

### El servidor indica que el puerto 3000 está ocupado

Detener la otra instancia con `Ctrl + C` o iniciar esta aplicación con
`npm run dev -- -p 3001`.

### La aplicación abre, pero la IA devuelve un error 502

1. Confirmar que existe `.env.local` en la misma carpeta que `package.json`.
2. Confirmar que `GEMINI_PROXY_API_KEY` tiene una clave real y no el texto de
   ejemplo.
3. Verificar que la URL del proxy y el modelo coincidan con `.env.example`.
4. Detener y volver a iniciar `npm run dev`.
5. Revisar la conexión a Internet y volver a intentar unos segundos después.

Un 502 también puede indicar que el proxy no respondió o que Gemini devolvió
una respuesta inválida. La aplicación no muestra el contenido sensible del
error; en desarrollo, la terminal y el campo `debug` de la respuesta permiten
identificar la etapa que falló.

### Los cambios desaparecen al recargar

Es el comportamiento esperado del MVP. El usuario y los datos iniciales están
hardcodeados y Zustand mantiene las ediciones solo durante la sesión. No se usa
`localStorage` ni una base de datos.

### Fallan dependencias o aparece una instalación inconsistente

Comprobar que se esté usando Node 20 o 22 y ejecutar nuevamente `npm ci`. No es
necesario instalar paquetes globales.

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
    ai/                       # Cliente, prompts, schemas y contexto de IA
    utils/                    # Moneda, fechas, cronograma, cn
    validations/              # Esquemas Zod
  store/                      # Zustand (evento) + hook SSR-safe
  types/                      # Tipos del dominio
docs/                         # Brief y registro de decisiones
```

Las rutas de IA son:

- `POST /api/ai/plan`: genera en paralelo la parte logística y creativa del
  plan, combina ambas respuestas y las valida.
- `POST /api/ai/budget`: genera la distribución porcentual y normaliza los
  importes contra el presupuesto total.

- El estado vive en un único store de Zustand en memoria, inicializado con un
  usuario hardcodeado. La aplicación no utiliza `localStorage`.
- La lectura del evento se centraliza en `useHydratedEvent`.
- Los datos ficticios están separados en `src/data/` y marcados como demo.

## Estado actual de la integración con IA

El cliente de Gemini existe en `src/lib/ai/gemini-proxy.ts`, importa
`server-only`, lee la clave desde variables de entorno, maneja timeout con
`AbortController` y traduce errores sin filtrar información sensible. Las rutas
`/api/ai/plan` y `/api/ai/budget` realizan llamadas reales al proxy estudiantil,
solicitan JSON estructurado y validan la respuesta con Zod antes de mostrarla o
aplicarla al presupuesto.

## Próximas etapas

1. Análisis de inspiración (imágenes de vestidos/decoración).
2. Memoria persistente de decisiones entre sesiones.
3. Autenticación y persistencia en la nube.
4. Proveedores reales.

## Medidas tomadas para proteger la API key

- El cliente de IA importa `server-only`: no puede ejecutarse en el navegador.
- La key se lee de variables de entorno del servidor, sin prefijo
  `NEXT_PUBLIC_`.
- La key nunca se registra en logs ni se envía al cliente.
- Los errores del proxy se traducen a mensajes genéricos para la usuaria.
- `.env.local` está en `.gitignore`.
