import "server-only";

/**
 * Cliente del proxy de Gemini. Módulo EXCLUSIVO del servidor: `server-only`
 * provoca un error de build si se importa desde el cliente.
 *
 * Contrato real del proxy (verificado): POST /api/gemini con
 * { model, prompt, generationConfig } y header Authorization: Bearer <key>.
 * Respuesta: { ok, text, usage: { chargedUsd, balanceUsd } }. En modo
 * estructurado, `text` es un string JSON.
 *
 * La API key se lee de variables de entorno, nunca se expone ni se registra.
 */

interface GenerationConfig {
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  responseMimeType?: string;
  responseSchema?: Record<string, unknown>;
  thinkingConfig?: { thinkingBudget: number };
}

interface GenerateTextParams {
  prompt: string;
  model?: string;
  generationConfig?: GenerationConfig;
  /** Timeout en milisegundos (por defecto 45s). */
  timeoutMs?: number;
}

export interface GeminiUsage {
  chargedUsd?: number;
  balanceUsd?: number;
}

export type GeminiResult =
  | { ok: true; text: string; usage?: GeminiUsage; model: string }
  | { ok: false; error: string; code: GeminiErrorCode };

export type GeminiErrorCode =
  | "not_configured"
  | "input_too_large"
  | "timeout"
  | "http_error"
  | "empty_response"
  | "network_error";

const DEFAULT_MODEL = "gemini-2.5-flash";
const DEFAULT_TIMEOUT_MS = 45_000;
/** Límite de tamaño de prompt para controlar costos y abusos. */
const MAX_PROMPT_CHARS = 16_000;

function getConfig(): { apiKey: string; baseUrl: string; model: string } | null {
  const apiKey = process.env.GEMINI_PROXY_API_KEY;
  const baseUrl = process.env.GEMINI_PROXY_BASE_URL;
  if (!apiKey || !baseUrl) return null;
  return {
    apiKey,
    baseUrl: baseUrl.replace(/\/$/, ""),
    model: process.env.GEMINI_TEXT_MODEL ?? DEFAULT_MODEL,
  };
}

/**
 * Genera texto contra el proxy. No se ejecuta durante el build: solo corre
 * cuando una ruta del servidor la invoca en tiempo de ejecución.
 */
export async function generateText(
  params: GenerateTextParams,
): Promise<GeminiResult> {
  const config = getConfig();
  if (!config) {
    return {
      ok: false,
      code: "not_configured",
      error: "La integración con IA no está configurada.",
    };
  }

  if (params.prompt.length > MAX_PROMPT_CHARS) {
    return {
      ok: false,
      code: "input_too_large",
      error: "Hay demasiada información para procesar. Reducí los datos.",
    };
  }

  const model = params.model ?? config.model;
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );

  try {
    const response = await fetch(`${config.baseUrl}/api/gemini`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        prompt: params.prompt,
        generationConfig: params.generationConfig ?? {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      // No exponemos el cuerpo del error del proxy ni la key.
      return {
        ok: false,
        code: "http_error",
        error: "No pudimos generar la respuesta en este momento.",
      };
    }

    const data: unknown = await response.json();
    const record = (data ?? {}) as Record<string, unknown>;
    const text = typeof record.text === "string" ? record.text : undefined;
    if (!text) {
      return {
        ok: false,
        code: "empty_response",
        error: "El servicio devolvió una respuesta vacía.",
      };
    }
    const usage =
      record.usage && typeof record.usage === "object"
        ? (record.usage as GeminiUsage)
        : undefined;
    return { ok: true, text, usage, model };
  } catch {
    // Incluye timeouts (AbortError) y errores de red.
    return {
      ok: false,
      code: "timeout",
      error: "El servicio de IA no respondió a tiempo. Probá de nuevo.",
    };
  } finally {
    clearTimeout(timeout);
  }
}

export type StructuredResult<T> =
  | { ok: true; data: T; usage?: GeminiUsage; model: string; raw: string }
  | { ok: false; error: string; code: GeminiErrorCode | "invalid_json" };

/**
 * Genera una respuesta estructurada (JSON) usando responseSchema y la parsea.
 * La validación de forma con Zod se hace en la ruta que la consume.
 */
export async function generateStructured(
  prompt: string,
  responseSchema: Record<string, unknown>,
  options?: { model?: string; timeoutMs?: number; temperature?: number },
): Promise<StructuredResult<unknown>> {
  const result = await generateText({
    prompt,
    model: options?.model,
    timeoutMs: options?.timeoutMs,
    generationConfig: {
      temperature: options?.temperature ?? 0.6,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  if (!result.ok) return { ok: false, error: result.error, code: result.code };

  try {
    const data: unknown = JSON.parse(result.text);
    return {
      ok: true,
      data,
      usage: result.usage,
      model: result.model,
      raw: result.text,
    };
  } catch {
    return {
      ok: false,
      code: "invalid_json",
      error: "La respuesta no tuvo el formato esperado.",
    };
  }
}
