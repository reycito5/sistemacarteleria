"use server";

import { revalidatePath } from "next/cache";
import { getContext, writeAudit, type ActionResult } from "./helpers";
import { viewContentSchema } from "@/lib/views/schemas";
import { FORM_SCHEMAS, type EditableKind } from "@/lib/views/formSchema";
import { viewNumberForKind } from "@/lib/views/registry";

function revalidate(id?: string) {
  revalidatePath("/admin/plantillas");
  if (id) revalidatePath(`/admin/plantillas/${id}`);
  revalidatePath("/admin/playlist");
}

/** Valida el contenido contra el esquema de la vista y extrae su título. */
function prepare(
  kind: EditableKind,
  data: Record<string, unknown>,
): { content: unknown; title: string } | { error: string } {
  const parsed = viewContentSchema.safeParse({ ...data, kind });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Contenido inválido" };
  }
  const titleKey = FORM_SCHEMAS[kind].titleKey;
  const raw = (data[titleKey] as string | undefined)?.trim();
  const title = raw && raw.length > 0 ? raw : FORM_SCHEMAS[kind].label;
  return { content: parsed.data, title };
}

export async function createContentItem(
  kind: EditableKind,
  data: Record<string, unknown>,
): Promise<ActionResult<string>> {
  const prep = prepare(kind, data);
  if ("error" in prep) return { ok: false, error: prep.error };

  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { supabase, userId } = ctx.data;

  const viewNumber = viewNumberForKind(kind);
  const { data: template } = await supabase
    .from("templates")
    .select("id")
    .eq("view_number", viewNumber ?? -1)
    .maybeSingle();
  if (!template) {
    return { ok: false, error: "No existe la plantilla para este tipo de vista." };
  }

  const { data: inserted, error } = await supabase
    .from("content_items")
    .insert({
      template_id: template.id,
      title: prep.title,
      content_data: prep.content as never,
      status: "aprobado",
      created_by: userId,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  await writeAudit(ctx.data, "crear", "content_item", inserted.id, { kind });
  revalidate(inserted.id);
  return { ok: true, data: inserted.id };
}

export async function updateContentItem(
  id: string,
  kind: EditableKind,
  data: Record<string, unknown>,
): Promise<ActionResult> {
  const prep = prepare(kind, data);
  if ("error" in prep) return { ok: false, error: prep.error };

  const ctx = await getContext();
  if (!ctx.ok) return ctx;

  const { error } = await ctx.data.supabase
    .from("content_items")
    .update({ title: prep.title, content_data: prep.content as never })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  await writeAudit(ctx.data, "editar", "content_item", id, { kind });
  revalidate(id);
  return { ok: true, data: undefined };
}

export async function deleteContentItem(id: string): Promise<ActionResult> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { error } = await ctx.data.supabase
    .from("content_items")
    .delete()
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  await writeAudit(ctx.data, "eliminar", "content_item", id);
  revalidate();
  return { ok: true, data: undefined };
}
