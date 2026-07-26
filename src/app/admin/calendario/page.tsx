import {
  listSchedules,
  listSchedulablePlaylists,
  type ScheduleView,
} from "@/lib/data/admin";
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
    <div>
      <h1 className="text-2xl font-black text-inst-blue-top">Calendario</h1>
      <p className="mt-1 max-w-2xl text-sm text-panel-muted">
        Programe cuándo se reproduce cada playlist en el grupo general: días, franja
        horaria, vigencia y prioridad (0 emergencia … 90 respaldo).
      </p>

      <div className="mt-6">
        {data === null ? (
          <div
            className="rounded-md border-l-4 bg-white px-4 py-3 text-sm"
            style={{ borderColor: "var(--color-inst-gold)" }}
          >
            <strong>Supabase no configurado.</strong> Configure el entorno e inicie
            sesión para gestionar el calendario.
          </div>
        ) : (
          <ScheduleManager playlists={data.playlists} schedules={data.schedules} />
        )}
      </div>
    </div>
  );
}
