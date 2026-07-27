"use server";

import { revalidatePath } from "next/cache";
import { getContext, writeAudit, type ActionResult } from "./helpers";
import {
  portalProgramSchema,
  programToDestacado,
  type PortalProgram,
} from "@/lib/integration/portal";
import { viewNumberForKind } from "@/lib/views/registry";

/**
 * Importa un programa del portal como contenido «Programa destacado». Es
 * idempotente por título: si ya existe, actualiza su content_data; si no, lo
 * crea. Así, cuando el portal cambia, la cartelería se actualiza sin reescribir.
 */
export async function importProgramAsDestacado(
  raw: PortalProgram,
): Promise<ActionResult<string>> {
  const parsed = portalProgramSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Programa del portal inválido." };
  }
  const program = parsed.data;
  const content = programToDestacado(program);

  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { supabase, userId } = ctx.data;

  const viewNumber = viewNumberForKind("programa_destacado");
  const { data: template } = await supabase
    .from("templates")
    .select("id")
    .eq("view_number", viewNumber ?? -1)
    .maybeSingle();
  if (!template) {
    return { ok: false, error: "No existe la plantilla de programa destacado." };
  }

  const { data: existing } = await supabase
    .from("content_items")
    .select("id")
    .eq("title", program.name)
    .limit(1)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("content_items")
      .update({ content_data: content as never })
      .eq("id", existing.id);
    if (error) return { ok: false, error: error.message };
    await writeAudit(ctx.data, "importar_actualizar", "content_item", existing.id, {
      portalId: program.id,
    });
    revalidatePath("/admin/plantillas");
    revalidatePath("/admin/oferta");
    return { ok: true, data: existing.id };
  }

  const { data: inserted, error } = await supabase
    .from("content_items")
    .insert({
      template_id: template.id,
      title: program.name,
      content_data: content as never,
      status: "aprobado",
      created_by: userId,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  await writeAudit(ctx.data, "importar_crear", "content_item", inserted.id, {
    portalId: program.id,
  });
  revalidatePath("/admin/plantillas");
  revalidatePath("/admin/oferta");
  return { ok: true, data: inserted.id };
}
