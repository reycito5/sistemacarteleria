import "server-only";
import {
  SAMPLE_PORTAL_PROGRAMS,
  normalizePortalPayload,
  type PortalProgram,
} from "./portal";

/**
 * Descarga de la oferta desde el Portal de Oferta Académica.
 *
 * `OFERTA_PORTAL_URL` admite dos formas, para que configurarlo no requiera
 * conocer la API del portal:
 *
 *   - La dirección del portal            → https://ofertaposgrado.vercel.app
 *   - Una ruta JSON concreta             → https://…/api/programas
 *
 * En el primer caso se prueban las rutas JSON habituales por orden. Si ninguna
 * responde, se intenta leer los datos incrustados en el HTML de la página.
 * Ante cualquier fallo se devuelve la oferta de muestra: la cartelería nunca
 * se queda sin contenido por un problema del portal.
 */

/** Rutas JSON que se prueban cuando se configura sólo el dominio del portal. */
const CANDIDATE_PATHS = [
  "/api/programas",
  "/api/programs",
  "/api/oferta",
  "/api/ofertas",
  "/programas.json",
  "/oferta.json",
];

const TIMEOUT_MS = 8000;

export type PortalSource = "portal" | "muestra";

export interface PortalAttempt {
  url: string;
  ok: boolean;
  /** Qué ocurrió: código HTTP, número de programas o motivo del fallo. */
  detail: string;
}

export interface PortalResult {
  programs: PortalProgram[];
  /** Origen de los datos: el portal real o la muestra de respaldo. */
  source: PortalSource;
  /** URL configurada en el entorno (`null` si falta). */
  configuredUrl: string | null;
  /** URL que finalmente sirvió los datos. */
  resolvedUrl: string | null;
  /** Traza de los intentos, para diagnosticar desde el panel. */
  attempts: PortalAttempt[];
}

/** Descarga con límite de tiempo, para no bloquear el panel. */
async function fetchWithTimeout(url: string, accept: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      headers: { accept },
      cache: "no-store",
      signal: controller.signal,
      redirect: "follow",
    });
  } finally {
    clearTimeout(timer);
  }
}

/** Construye la lista de URL a probar a partir de lo configurado. */
function candidateUrls(configured: string): string[] {
  let base: URL;
  try {
    base = new URL(configured);
  } catch {
    return [];
  }

  const hasPath = base.pathname !== "/" && base.pathname !== "";
  // Si ya apunta a una ruta concreta, se respeta y se prueba primero.
  const urls = hasPath ? [base.toString()] : [];
  for (const path of CANDIDATE_PATHS) {
    urls.push(new URL(path, base.origin).toString());
  }
  // Como último recurso, la propia página (para leer el HTML).
  urls.push(base.origin + (hasPath ? base.pathname : "/"));
  return [...new Set(urls)];
}

/**
 * Extrae objetos JSON incrustados en el HTML de un portal Next.js
 * (`__NEXT_DATA__` o los fragmentos de `self.__next_f.push`).
 */
function programsFromHtml(html: string, baseUrl: string): PortalProgram[] {
  const nextData = html.match(
    /<script[^>]+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i,
  );
  if (nextData?.[1]) {
    try {
      const parsed: unknown = JSON.parse(nextData[1]);
      const programs = normalizePortalPayload(parsed, baseUrl);
      if (programs.length > 0) return programs;
    } catch {
      // Sigue con el resto de estrategias.
    }
  }

  // Datos serializados por el App Router en fragmentos de texto.
  for (const match of html.matchAll(/self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g)) {
    const chunk = match[1];
    if (!/program|oferta|maestr|diplomad/i.test(chunk)) continue;
    try {
      // El fragmento viene escapado dentro de una cadena JavaScript.
      const decoded: unknown = JSON.parse(`"${chunk}"`);
      if (typeof decoded !== "string") continue;
      const jsonStart = decoded.indexOf("[{");
      if (jsonStart === -1) continue;
      const candidate: unknown = JSON.parse(
        decoded.slice(jsonStart, decoded.lastIndexOf("}]") + 2),
      );
      const programs = normalizePortalPayload(candidate, baseUrl);
      if (programs.length > 0) return programs;
    } catch {
      // Fragmento no utilizable: se ignora.
    }
  }

  return [];
}

export async function fetchPortalPrograms(): Promise<PortalResult> {
  const configured = process.env.OFERTA_PORTAL_URL?.trim() || null;
  const attempts: PortalAttempt[] = [];

  const fallback = (): PortalResult => ({
    programs: SAMPLE_PORTAL_PROGRAMS,
    source: "muestra",
    configuredUrl: configured,
    resolvedUrl: null,
    attempts,
  });

  if (!configured) return fallback();

  const urls = candidateUrls(configured);
  if (urls.length === 0) {
    attempts.push({
      url: configured,
      ok: false,
      detail: "La dirección configurada no es una URL válida.",
    });
    return fallback();
  }

  for (const url of urls) {
    try {
      const res = await fetchWithTimeout(url, "application/json, text/html");
      if (!res.ok) {
        attempts.push({ url, ok: false, detail: `HTTP ${res.status}` });
        continue;
      }

      const contentType = res.headers.get("content-type") ?? "";
      const body = await res.text();

      const programs = contentType.includes("json")
        ? normalizePortalPayload(JSON.parse(body) as unknown, url)
        : programsFromHtml(body, url);

      if (programs.length === 0) {
        attempts.push({
          url,
          ok: false,
          detail: contentType.includes("json")
            ? "Respondió JSON, pero sin programas reconocibles."
            : "Respondió HTML, sin datos de programas incrustados.",
        });
        continue;
      }

      attempts.push({
        url,
        ok: true,
        detail: `${programs.length} programa(s) obtenidos.`,
      });
      return {
        programs,
        source: "portal",
        configuredUrl: configured,
        resolvedUrl: url,
        attempts,
      };
    } catch (err) {
      attempts.push({
        url,
        ok: false,
        detail:
          err instanceof Error && err.name === "AbortError"
            ? `Sin respuesta en ${TIMEOUT_MS / 1000} s.`
            : err instanceof Error
              ? err.message
              : "Error desconocido.",
      });
    }
  }

  return fallback();
}
