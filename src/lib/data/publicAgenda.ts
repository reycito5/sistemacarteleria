import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { agendaSchema, type AgendaContent } from "@/lib/views/schemas";
import { PLAYABLE_STATUSES } from "@/lib/views/workflow";

export interface AgendaEntry {
  title: string;
  date: string;
  time: string;
  place: string;
}

export interface PublicAgenda {
  entries: AgendaEntry[];
  /** `contenido` si viene del panel; `muestra` si es el ejemplo de respaldo. */
  source: "contenido" | "muestra";
}

/** Agenda de ejemplo, coherente con la vista institucional de referencia. */
const SAMPLE_ENTRIES: AgendaEntry[] = [
  {
    title: "Defensa de Tesis — Maestría en Educación Superior",
    date: "26/07/2026",
    time: "09:00",
    place: "Sala Académica",
  },
  {
    title: "Presentación de Proyecto — Diplomado en Inteligencia Artificial",
    date: "26/07/2026",
    time: "11:30",
    place: "Sala 2",
  },
  {
    title: "Conferencia Académica — Innovación y Educación Superior",
    date: "28/07/2026",
    time: "15:00",
    place: "Auditorio de Posgrado",
  },
];

/**
 * Agenda pública del Vicerrectorado.
 *
 * Sale de los contenidos de tipo «agenda» que ya están aprobados o publicados
 * en el panel: es decir, de lo que realmente se está emitiendo o está listo
 * para emitirse. Los borradores nunca se muestran aquí.
 *
 * Si el entorno no está configurado o no hay agendas cargadas, devuelve un
 * ejemplo para que la página pública nunca quede vacía.
 */
export async function getPublicAgenda(): Promise<PublicAgenda> {
  const fallback: PublicAgenda = { entries: SAMPLE_ENTRIES, source: "muestra" };

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return fallback; // entorno sin Supabase
  }

  try {
    // El tipo de vista no es una columna: vive dentro de `content_data.kind`,
    // así que se filtra en memoria tras traer los contenidos emitibles.
    const { data, error } = await supabase
      .from("content_items")
      .select("content_data")
      .in("status", PLAYABLE_STATUSES)
      .order("created_at", { ascending: false })
      .limit(40);

    if (error || !data || data.length === 0) return fallback;

    const entries: AgendaEntry[] = [];
    for (const row of data) {
      const raw = row.content_data as { kind?: string } | null;
      if (raw?.kind !== "agenda") continue;

      const parsed = agendaSchema.safeParse(raw);
      if (!parsed.success) continue;
      const content: AgendaContent = parsed.data;
      for (const item of content.items) {
        entries.push({
          title: item.title,
          date: item.date,
          time: item.time,
          place: item.place,
        });
      }
    }

    return entries.length > 0
      ? { entries, source: "contenido" }
      : fallback;
  } catch {
    return fallback;
  }
}
