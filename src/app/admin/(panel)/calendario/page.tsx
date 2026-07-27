import { CalendarClock } from "lucide-react";
import {
  listSchedules,
  listSchedulablePlaylists,
  type ScheduleView,
} from "@/lib/data/admin";
import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { ScheduleManager } from "./ScheduleManager";

export const dynamic = "force-dynamic";

interface LoadedData {
  playlists: { id: string; name: string; status: string }[];
  schedules: ScheduleView[];
}

async function loadData(): Promise<LoadedData | null> {
  try {
    const [playlists, schedules] = await Promise.all([
      listSchedulablePlaylists(),
      listSchedules(),
    ]);
    return { playlists, schedules };
  } catch {
    return null;
  }
}

export default async function CalendarioPage() {
  const data = await loadData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="2 · Emisión"
        title="Calendario de programación"
        description="Opcional. Permite que una playlist se emita sólo ciertos días u horas. Sin ninguna programación activa, los televisores emiten la playlist publicada durante todo el día."
      />

      <Alert tone="info" title="Cómo se resuelven las coincidencias">
        Si dos programaciones se solapan en el mismo momento, gana la de{" "}
        <strong>menor número de prioridad</strong> (0 es lo más urgente, 90 es el
        respaldo). Un comunicado de emergencia está por encima de todas ellas.
      </Alert>

      {data === null ? (
        <Alert tone="warn" title="Supabase no está configurado">
          Configure el entorno e inicie sesión para gestionar el calendario.
        </Alert>
      ) : (
        <ScheduleManager playlists={data.playlists} schedules={data.schedules} />
      )}

      <p className="flex items-center gap-2 text-xs text-ui-muted">
        <CalendarClock size={14} aria-hidden />
        Las programaciones se aplican al grupo general: afectan a las cuatro
        pantallas por igual.
      </p>
    </div>
  );
}
