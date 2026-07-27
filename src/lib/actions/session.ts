"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Cierra la sesión del panel y devuelve al acceso.
 *
 * Se ejecuta en el servidor para que las cookies de sesión se borren en la
 * misma respuesta y el middleware ya no reconozca al usuario.
 */
export async function signOut(): Promise<never> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Entorno sin Supabase configurado: igualmente se vuelve al acceso.
  }
  redirect("/admin/login");
}
