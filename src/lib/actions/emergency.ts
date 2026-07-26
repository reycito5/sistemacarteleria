"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getContext, writeAudit, type ActionResult } from "./helpers";

const emergencyInput = z.object({
  title: z.string().min(3, "El título es obligatorio"),
  message: z.string().default(""),
  instructions: z.string().default(""),
  severity: z.enum(["alerta", "urgente", "critico"]).default("urgente"),
});

export type EmergencyInput = z.infer<typeof emergencyInput>;

function revalidate() {
  revalidatePath("/admin/comunicados");
  revalidatePath("/admin");
}

/**
 * Activa una emergencia institucional (prioridad absoluta, sección 16).
 * Aparece de inmediato en las cuatro pantallas a través del manifiesto.
 */
export async function activateEmergency(
  raw: EmergencyInput,
): Promise<ActionResult> {
  const parsed = emergencyInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { supabase, userId } = ctx.data;

  const { data, error } = await supabase
    .from("emergency_messages")
    .insert({
      title: parsed.data.title,
      message: parsed.data.message,
      instructions: parsed.data.instructions,
      severity: parsed.data.severity,
      active: true,
      created_by: userId,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  await writeAudit(ctx.data, "activar_emergencia", "emergency_message", data.id, parsed.data);
  revalidate();
  return { ok: true, data: undefined };
}

/** Desactiva una emergencia: las pantallas vuelven a la programación general. */
export async function deactivateEmergency(id: string): Promise<ActionResult> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { error } = await ctx.data.supabase
    .from("emergency_messages")
    .update({ active: false, end_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  await writeAudit(ctx.data, "desactivar_emergencia", "emergency_message", id);
  revalidate();
  return { ok: true, data: undefined };
}
