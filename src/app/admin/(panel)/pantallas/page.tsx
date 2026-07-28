import { MonitorPlay, Radio, TriangleAlert } from "lucide-react";
import { listScreensStatus, type ScreenStatusView } from "@/lib/data/admin";
import { AutoRefresh } from "@/components/admin/AutoRefresh";
import { RealtimeScreens } from "@/components/admin/RealtimeScreens";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";
import { ActivateScreenForm } from "./ActivateScreenForm";

export const dynamic = "force-dynamic";

function relativeTime(iso: string | null): string {
  if (!iso) return "nunca";
  const diff = Math.round((Date.now() - Date.parse(iso)) / 1000);
  if (diff < 60) return `hace ${Math.max(diff, 0)} s`;
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
  const online = screens?.filter((s) => s.online).length ?? 0;

  return (
    <div className="space-y-6">
      <AutoRefresh seconds={30} />
      <RealtimeScreens />

      <PageHeader
        eyebrow="Paso 4 · Operación"
        title="Centro de pantallas"
        description="Estado en vivo de los televisores del grupo general. Cada equipo informa de su situación cada 20 segundos; si deja de hacerlo durante un minuto, se marca como desconectado."
        actions={
          <Badge tone="ok" dot className="ui-pulse">
            En vivo
          </Badge>
        }
      />

      {screens === null ? (
        <Alert tone="warn" title="Supabase no está configurado">
          Configure el entorno e inicie sesión para ver el estado de las
          pantallas.
        </Alert>
      ) : screens.length === 0 ? (
        <EmptyState
          icon={<MonitorPlay size={26} />}
          title="No hay pantallas registradas"
          description="Aplique la migración de datos iniciales (0003_seed.sql) o registre un televisor con el código de activación de abajo."
        />
      ) : (
        <>
          {online < screens.length && (
            <Alert
              tone="warn"
              title={`${screens.length - online} pantalla(s) sin conexión`}
            >
              Verifique que el equipo esté encendido, con el reproductor abierto
              y con acceso a la red. Mientras tanto sigue emitiendo el contenido
              que tenía guardado.
            </Alert>
          )}

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {screens.map((s) => (
              <li key={s.id} className="ui-card p-5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-extrabold uppercase leading-tight text-brand-ink">
                    {s.location || s.name}
                  </p>
                  <Badge tone={s.online ? "ok" : "danger"} dot>
                    {s.online ? "En línea" : "Caída"}
                  </Badge>
                </div>
                <p className="ui-tnum mt-1 text-[11px] tracking-widest text-ui-faint">
                  {s.code}
                </p>

                <div className="mt-4 border-t border-ui-border pt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-ui-muted">
                    Reproduciendo
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[13px] font-semibold text-ui-ink">
                    {s.currentContentTitle ?? "—"}
                  </p>
                </div>

                <dl className="mt-3 space-y-1 text-[11px] text-ui-muted">
                  <div className="flex justify-between gap-2">
                    <dt>Posición</dt>
                    <dd className="ui-tnum font-semibold text-ui-ink">
                      {fmtPos(s.currentPositionSeconds)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Versión de playlist</dt>
                    <dd className="ui-tnum font-semibold text-ui-ink">
                      {s.playlistVersion ?? "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Último latido</dt>
                    <dd className="flex items-center gap-1 font-semibold text-ui-ink">
                      {!s.online && (
                        <TriangleAlert
                          size={11}
                          className="text-brand-red"
                          aria-hidden
                        />
                      )}
                      {relativeTime(s.lastSeenAt)}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}

      {screens !== null && (
        <Card>
          <CardHeader
            icon={<Radio size={18} />}
            title="Activar un televisor nuevo"
            description="Abra /player/activar en el equipo, anote el código de 6 dígitos que muestra y confírmelo aquí. Hasta que se confirme, el televisor no recibe programación."
          />
          <div className="mt-5 max-w-xl">
            <ActivateScreenForm />
          </div>
        </Card>
      )}
    </div>
  );
}
