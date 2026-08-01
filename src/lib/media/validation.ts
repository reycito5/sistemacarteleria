import type { MediaType } from "@/lib/supabase/database.types";
import type { MediaCategory } from "@/lib/media/categories";

/**
 * Validación de archivos multimedia (secciones 24 y 25 del prompt maestro).
 * Funciones puras y deterministas: se usan tanto en el cliente (antes de subir)
 * como en el servidor (antes de registrar el asset).
 */

export const MEDIA_LIMITS = {
  video: {
    maxBytes: 500 * 1024 * 1024, // 500 MB
    mimes: ["video/mp4"],
    extensions: [".mp4"],
  },
  image: {
    maxBytes: 15 * 1024 * 1024, // 15 MB
    mimes: ["image/jpeg", "image/png", "image/webp"],
    extensions: [".jpg", ".jpeg", ".png", ".webp"],
  },
} as const;

/** Resolución institucional recomendada (Full HD 16:9). */
export const RECOMMENDED = { width: 1920, height: 1080, aspect: 16 / 9 } as const;
export const RECOMMENDED_POSTER = { width: 1080, height: 1350, aspect: 4 / 5 } as const;

export interface FileMeta {
  name: string;
  type: string;
  size: number;
}

export interface ValidationResult {
  ok: boolean;
  mediaType: MediaType | null;
  error?: string;
}

/** Clasifica un MIME como video, imagen o no admitido. */
export function classifyMediaType(mime: string): MediaType | null {
  if (MEDIA_LIMITS.video.mimes.includes(mime as never)) return "video";
  if (MEDIA_LIMITS.image.mimes.includes(mime as never)) return "image";
  return null;
}

function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot).toLowerCase();
}

/**
 * Valida tipo, extensión y tamaño. Rechaza ejecutables y formatos no admitidos
 * (protección de la sección 29).
 */
export function validateFile(file: FileMeta): ValidationResult {
  const mediaType = classifyMediaType(file.type);
  if (!mediaType) {
    return {
      ok: false,
      mediaType: null,
      error:
        "Formato no admitido. Solo videos MP4 (H.264) o imágenes JPG, PNG o WebP.",
    };
  }

  const limits = MEDIA_LIMITS[mediaType];
  const ext = extensionOf(file.name);
  if (!limits.extensions.includes(ext as never)) {
    return {
      ok: false,
      mediaType,
      error: `Extensión ${ext || "(ninguna)"} no válida para ${mediaType}.`,
    };
  }

  if (file.size <= 0) {
    return { ok: false, mediaType, error: "El archivo está vacío." };
  }
  if (file.size > limits.maxBytes) {
    return {
      ok: false,
      mediaType,
      error: `El archivo supera el máximo de ${Math.round(
        limits.maxBytes / (1024 * 1024),
      )} MB.`,
    };
  }

  return { ok: true, mediaType };
}

/** Comprueba si unas dimensiones cumplen la relación 16:9 (con tolerancia). */
export function is16by9(width: number, height: number, tolerance = 0.02): boolean {
  if (width <= 0 || height <= 0) return false;
  return Math.abs(width / height - RECOMMENDED.aspect) <= tolerance;
}

export function is4by5(width: number, height: number, tolerance = 0.03): boolean {
  if (width <= 0 || height <= 0) return false;
  return Math.abs(width / height - RECOMMENDED_POSTER.aspect) <= tolerance;
}

export function hasRecommendedAspect(
  width: number,
  height: number,
  mediaType: MediaType,
  category: MediaCategory,
): boolean {
  if (mediaType === "image" && category === "programa_destacado") {
    return is4by5(width, height);
  }
  return is16by9(width, height);
}

/** Genera una ruta de almacenamiento segura y única para el asset. */
export function buildStoragePath(
  mediaType: MediaType,
  fileName: string,
  category: MediaCategory = "general",
): string {
  const ext = extensionOf(fileName) || (mediaType === "video" ? ".mp4" : ".jpg");
  const slug = fileName
    .slice(0, fileName.lastIndexOf(".") === -1 ? undefined : fileName.lastIndexOf("."))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "archivo";
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `plantillas/${category}/${mediaType}/${stamp}-${rand}-${slug}${ext}`;
}
