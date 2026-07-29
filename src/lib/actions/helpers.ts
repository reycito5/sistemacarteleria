import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export interface ActionContext {
  supabase: SupabaseClient<Database>;
  userId: string;
}

/**
 * Obtiene el cliente de servidor y el usuario autenticado. Todas las Server
 * Actions de escritura pasan por aquí; RLS aplica los permisos por rol.
 */
export async function getContext(): Promise<ActionResult<ActionContext>> {
  let supabase: SupabaseClient<Database>;
  try {
    supabase = await createClient();
  } catch {
    return { ok: false, error: "Servidor no configurado (Supabase)." };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesión no válida. Inicie sesión." };
  return { ok: true, data: { supabase, userId: user.id } };
}

/** Registro de auditoría (sección 29). Nunca interrumpe la acción principal. */
export async function writeAudit(
  ctx: ActionContext,
  action: string,
  entityType: string,
  entityId: string | null,
  newData: unknown = null,
): Promise<void> {
  try {
    await ctx.supabase.from("audit_logs").insert({
      user_id: ctx.userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      new_data: newData as never,
    });
  } catch {
    // La auditoría no debe bloquear la operación.
  }
}
