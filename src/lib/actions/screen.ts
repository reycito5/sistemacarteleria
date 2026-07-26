"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getContext, writeAudit, type ActionResult } from "./helpers";
import { getGeneralGroupId } from "@/lib/data/admin";
import { isActivationExpired, isValidActivationCode } from "@/lib/player/activation";

const activateInput = z.object({
  activationCode: z.string().refine(isValidActivationCode, "Código de 6 dígitos"),
  name: z.string().min(2, "El nombre es obligatorio"),
  location: z.string().default(""),
});

export type ActivateScreenInput = z.infer<typeof activateInput>;

function revalidate() {
  revalidatePath("/admin/pantallas");
  revalidatePath("/admin");
}

/**
 * Confirma la activación de una pantalla (sección 22, pasos 4–7): asigna nombre
 * y ubicación, la añade al grupo general, marca la activación y limpia el código
 * temporal. Solo personal técnico o superadmin (RLS lo refuerza).
 */
export async function activateScreen(
  raw: ActivateScreenInput,
): Promise<ActionResult> {
  const parsed = activateInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;

  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { supabase } = ctx.data;

  const { data: screen } = await supabase
    .from("screens")
    .select("id, activation_expires_at, activated_at")
    .eq("activation_code", d.activationCode)
    .maybeSingle();

  if (!screen) return { ok: false, error: "Código no encontrado." };
  if (screen.activated_at) {
    return { ok: false, error: "Ese código ya fue activado." };
  }
  if (isActivationExpired(screen.activation_expires_at)) {
    return { ok: false, error: "El código de activación expiró. Solicite uno nuevo." };
  }

  const { error: upErr } = await supabase
    .from("screens")
    .update({
      name: d.name,
      location: d.location,
      status: "desconectada",
      activated_at: new Date().toISOString(),
      activation_code: null,
      activation_expires_at: null,
    })
    .eq("id", screen.id);

  if (upErr) return { ok: false, error: upErr.message };

  // Añadir al grupo institucional general.
  const groupId = await getGeneralGroupId();
  if (groupId) {
    await supabase
      .from("screen_group_members")
      .insert({ screen_id: screen.id, group_id: groupId });
  }

  await writeAudit(ctx.data, "activar", "screen", screen.id, {
    name: d.name,
    location: d.location,
  });
  revalidate();
  return { ok: true, data: undefined };
}

/** Elimina una pantalla (desvincula un dispositivo). */
export async function removeScreen(id: string): Promise<ActionResult> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { error } = await ctx.data.supabase.from("screens").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  await writeAudit(ctx.data, "eliminar", "screen", id);
  revalidate();
  return { ok: true, data: undefined };
}
