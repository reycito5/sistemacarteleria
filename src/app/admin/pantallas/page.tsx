import { listScreensStatus, type ScreenStatusView } from "@/lib/data/admin";
import { AutoRefresh } from "@/components/admin/AutoRefresh";
import { RealtimeScreens } from "@/components/admin/RealtimeScreens";
import { ActivateScreenForm } from "./ActivateScreenForm";

export const dynamic = "force-dynamic";

function relativeTime(iso: string | null): string {
  if (!iso) return "nunca";
  const diff = Math.round((Date.now() - Date.parse(iso)) / 1000);
  if (diff < 60) return `hace ${diff}s`;
  if (diff < 3600) return `hace ${Math.round(diff / 60)} min`;
  return `hace ${Math.round(diff / 3600)} h`;
}

function fmtPos(sec: number | null): string {
  if (sec === null) return "—";
  const s = Math.floor(sec);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

async function loadScreens(): Promise<ScreenStatusView[] | null> {
  try {
    return await listScreensStatus();
  } catch {
    return null;
  }
}

export default async function PantallasPage() {
  const screens = await loadScreens();

  return (
    <div>
      <AutoRefresh seconds={30} />
      <RealtimeScreens />
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-black text-inst-blue-top">Centro de pantallas</h1>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-panel-muted">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          en vivo · Realtime
        </span>
      </div>
      <p className="mt-1 text-sm text-panel-muted">
        Estado, contenido actual y última conexión de las cuatro pantallas del grupo
        general.
      </p>

      {screens === null ? (
        <div
          className="mt-6 rounded-md border-l-4 bg-white px-4 py-3 text-sm"
          style={{ borderColor: "var(--color-inst-gold)" }}
        >
          <strong>Supabase no configurado.</strong> Configure el entorno e inicie
          sesión para ver el estado de las pantallas.
        </div>
      ) : screens.length === 0 ? (
        <p className="mt-6 text-sm text-panel-muted">
          No hay pantallas registradas. Aplique el seed (migración 0003).
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {screens.map((s) => (
            <div
              key={s.id}
              className="rounded-md border bg-white p-4"
              style={{ borderColor: "var(--color-panel-border)" }}
            >
              <div className="flex items-center justify-between">
                <p className="font-extrabold uppercase text-inst-blue-top">
                  {s.location || s.name}
                </p>
                <span
                  className="flex items-center gap-1.5 text-xs font-bold"
                  style={{ color: s.online ? "#137333" : "#C52322" }}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: s.online ? "#34a853" : "#C52322" }}
                  />
                  {s.online ? "En línea" : "Desconectada"}
                </span>
              </div>
              <p className="mt-3 text-xs text-panel-muted">Reproduciendo</p>
              <p className="text-sm font-semibold">
                {s.currentContentTitle ?? "—"}
              </p>
              <div className="mt-2 space-y-0.5 text-xs text-panel-muted">
                <p>
                  Posición: <span className="font-mono">{fmtPos(s.currentPositionSeconds)}</span>
                </p>
                <p>Versión playlist: {s.playlistVersion ?? "—"}</p>
                <p>Última conexión: {relativeTime(s.lastSeenAt)}</p>
                <p>Código: {s.code}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {screens !== null && (
        <div className="mt-8 max-w-2xl">
          <ActivateScreenForm />
        </div>
      )}
    </div>
  );
}
