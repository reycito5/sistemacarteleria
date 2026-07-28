"use server";

import { revalidatePath } from "next/cache";
import { getContext, writeAudit, type ActionResult } from "./helpers";

export interface IdentityInput {
  universityName: string;
  vicerrectorateName: string;
  phones: string[];
  email: string;
  location: string;
  social: string[];
  tickerLabel: string;
  tickerText: string;
  /** Rutas en el bucket `media`; `null` retira el logo. */
  logoPrimaryPath: string | null;
  logoSecondaryPath: string | null;
}

/** Limpia una lista de textos: recorta, descarta vacíos y limita el tamaño. */
function cleanList(values: string[], max: number): string[] {
  return values
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, max);
}

/**
 * Guarda la identidad institucional (logos, contactos, rótulo).
 *
 * Afecta a la cabecera y el pie de TODAS las pantallas a la vez, así que sólo
 * puede hacerlo quien tiene permiso de publicación (lo aplica RLS).
 */
export async function saveInstitutionIdentity(
  input: IdentityInput,
): Promise<ActionResult> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { supabase } = ctx.data;

  const universityName = input.universityName.trim();
  const vicerrectorateName = input.vicerrectorateName.trim();
  if (!universityName || !vicerrectorateName) {
    return {
      ok: false,
      error: "El nombre de la universidad y del vicerrectorado son obligatorios.",
    };
  }

  const payload = {
    university_name: universityName,
    vicerrectorate_name: vicerrectorateName,
    phones: cleanList(input.phones, 4),
    email: input.email.trim(),
    location: input.location.trim(),
    social: cleanList(input.social, 5),
    ticker_label: input.tickerLabel.trim(),
    ticker_text: input.tickerText.trim(),
    logo_primary_path: input.logoPrimaryPath,
    logo_secondary_path: input.logoSecondaryPath,
    updated_at: new Date().toISOString(),
    updated_by: ctx.data.userId,
  };

  const { error } = await supabase
    .from("institution_settings")
    .update(payload)
    .eq("singleton", true);

  if (error) return { ok: false, error: error.message };

  await writeAudit(ctx.data, "actualizar", "institution_settings", null, payload);

  // La identidad se pinta en todas las pantallas y en el portal público.
  revalidatePath("/admin/identidad");
  revalidatePath("/preview");
  revalidatePath("/player");

  return { ok: true, data: undefined };
}
