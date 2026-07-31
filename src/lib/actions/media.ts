"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getContext, writeAudit, type ActionResult } from "./helpers";
import { hasRecommendedAspect } from "@/lib/media/validation";
import {
  MEDIA_CATEGORIES,
  type MediaCategory,
} from "@/lib/media/categories";

const registerSchema = z.object({
  title: z.string().min(2, "El título es obligatorio"),
  storagePath: z.string().min(1),
  mediaType: z.enum(["video", "image"]),
  mimeType: z.string().min(1),
  fileSize: z.number().int().positive(),
  width: z.number().int().positive().nullish(),
  height: z.number().int().positive().nullish(),
  durationSeconds: z.number().positive().nullish(),
  thumbnailPath: z.string().nullish(),
  subtitlePath: z.string().nullish(),
  category: z.enum(MEDIA_CATEGORIES.map((item) => item.id) as [string, ...string[]]),
});

export type RegisterMediaInput = z.infer<typeof registerSchema>;

function revalidate() {
  revalidatePath("/admin/biblioteca");
  revalidatePath("/admin");
}

/**
 * Registra en la base un archivo ya subido a Storage por el cliente. Marca el
 * asset como validado solo si cumple la relación 16:9 (secciones 24/25); en
 * caso contrario queda pendiente de revisión.
 */
export async function registerMediaAsset(
  raw: RegisterMediaInput,
): Promise<ActionResult<string>> {
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;

  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { supabase, userId } = ctx.data;

  const dimsOk =
    d.width && d.height
      ? hasRecommendedAspect(
          d.width,
          d.height,
          d.mediaType,
          d.category as MediaCategory,
        )
      : d.mediaType === "video";

  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      title: d.title,
      type: d.mediaType,
      storage_path: d.storagePath,
      thumbnail_path: d.thumbnailPath ?? null,
      subtitle_path: d.subtitlePath ?? null,
      mime_type: d.mimeType,
      file_size: d.fileSize,
      width: d.width ?? null,
      height: d.height ?? null,
      duration_seconds: d.durationSeconds ?? null,
      status: dimsOk ? "validado" : "pendiente",
      created_by: userId,
      description: `library-category:${d.category}`,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  await writeAudit(ctx.data, "subir", "media_asset", data.id, {
    title: d.title,
    type: d.mediaType,
  });
  revalidate();
  return { ok: true, data: data.id };
}

/** Elimina el asset de la biblioteca y su archivo de Storage. */
export async function deleteMediaAsset(id: string): Promise<ActionResult> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { supabase } = ctx.data;

  const { data: asset } = await supabase
    .from("media_assets")
    .select("storage_path, thumbnail_path, subtitle_path")
    .eq("id", id)
    .maybeSingle();

  if (asset?.storage_path) {
    const paths = [asset.storage_path, asset.thumbnail_path, asset.subtitle_path].filter(
      (path): path is string => Boolean(path),
    );
    await supabase.storage.from("media").remove(paths);
  }

  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  await writeAudit(ctx.data, "eliminar", "media_asset", id);
  revalidate();
  return { ok: true, data: undefined };
}
