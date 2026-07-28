import Link from "next/link";
import {
  ArrowRight,
  CircleSlash,
  LibraryBig,
  ListVideo,
  MonitorPlay,
  Radio,
  Siren,
  SquareStack,
  TriangleAlert,
} from "lucide-react";
import { INSTITUTION } from "@/lib/design/tokens";
import {
  getActiveEmergency,
  listContentItems,
  listMediaAssets,
  listScreensStatus,
  type ContentItemSummary,
  type ScreenStatusView,
} from "@/lib/data/admin";
import { AutoRefresh } from "@/components/admin/AutoRefresh";
import { RealtimeScreens } from "@/components/admin/RealtimeScreens";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { WorkflowSteps } from "@/components/admin/WorkflowSteps";

export const dynamic = "force-dynamic";

interface DashboardData {
  screens: ScreenStatusView[];
  contents: ContentItemSummary[];
  mediaCount: number;
  emergencyTitle: string | null;
}

async function loadDashboard(): Promise<DashboardData | null> {
  try {
    const [screens, emergency, contents, media] = await Promise.all([
      listScreensStatus(),
      getActiveEmergency(),
      listContentItems(),
      listMediaAssets(),
    ]);
    return {
      screens,
      contents,
      mediaCount: media.length,
      emergencyTitle: emergency?.title ?? null,
    };
  } catch {
    return null;
  }
}

/** «hace 2 min» a partir de una marca de tiempo ISO. */
function relativeTime(iso: string | null): string {
  if (!iso) return "sin datos";
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return `hace ${Math.max(seconds, 0)} s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  return `hace ${Math.round(hours / 24)} d`;
}

export default async function AdminDashboard() {
  const data = await loadDashboard();

  const screens = data?.screens ?? [];
  const online = screens.filter((s) => s.online).length;
  const total = screens.length;
  const approved =
    data?.contents.filter((c) => c.status === "aprobado").length ?? 0;
  const drafts = data?.contents.filter((c) => c.status === "borrador").length ?? 0;

  return (
    <div className="space-y-6">
      <AutoRefresh seconds={30} />
      <RealtimeScreens />

      <PageHeader
        eyebrow="Inicio"
        title="Panel general"
        description={`Estado en vivo del grupo ${INSTITUTION.generalGroup}. Las cuatro pantallas comparten una única programación institucional.`}
        actions={
          <ButtonLink href="/player" target="_blank" variant="secondary">
            <MonitorPlay size={16} aria-hidden />
            Ver el reproductor
          </ButtonLink>
        }
      />

      {data === null && (
        <Alert tone="warn" title="Supabase no está configurado">
          Defina las variables de entorno del proyecto e inicie sesión para ver
          los datos reales de las pantallas, la biblioteca y la programación.
        </Alert>
      )}

      {data?.emergencyTitle && (
        <Link href="/admin/comunicados" className="block">
          <Alert
            tone="danger"
            title={`Comunicado urgente activo: ${data.emergencyTitle}`}
          >
            Está interrumpiendo la programación de las cuatro pantallas. Pulse
            aquí para gestionarlo o desactivarlo.
          </Alert>
        </Link>
      )}

      {/* Métricas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pantallas en línea"
          value={`${online}/${total}`}
          icon={<MonitorPlay size={17} />}
          tone={
            total > 0 && online === total ? "ok" : online === 0 ? "danger" : "warn"
          }
          badge={
            total === 0
              ? "Sin registrar"
              : online === total
                ? "Todas activas"
                : "Revisar"
          }
        />
        <StatCard
          label="Archivos en biblioteca"
          value={String(data?.mediaCount ?? 0)}
          icon={<LibraryBig size={17} />}
          tone="info"
          note="Videos e imágenes"
        />
        <StatCard
          label="Contenidos aprobados"
          value={String(approved)}
          icon={<SquareStack size={17} />}
          tone="info"
          note={drafts > 0 ? `${drafts} en borrador` : "Listos para la playlist"}
        />
        <StatCard
          label="Comunicado urgente"
          value={data?.emergencyTitle ? "Activo" : "—"}
          icon={<Siren size={17} />}
          tone={data?.emergencyTitle ? "danger" : "neutral"}
          note={data?.emergencyTitle ? "Interrumpe todo" : "Sin emergencias"}
        />
      </div>

      {/* Recordatorio del flujo */}
      <Card>
        <CardHeader
          icon={<ListVideo size={18} />}
          title="El recorrido del contenido"
          description="Un archivo sólo llega al televisor si recorre los cuatro pasos. Si algo no aparece en pantalla, revise en qué paso se quedó."
        />
        <WorkflowSteps className="mt-5" />
      </Card>

      {/* Centro de pantallas */}
      <Card flush>
        <div className="border-b border-ui-border p-5 sm:p-6">
          <CardHeader
            icon={<Radio size={18} />}
            title="Centro de pantallas"
            description="Cada televisor informa de su estado cada 20 segundos."
            actions={
              <Link
                href="/admin/pantallas"
                className="inline-flex items-center gap-1 text-[13px] font-bold text-inst-red transition hover:gap-2"
              >
                Ver detalle <ArrowRight size={14} aria-hidden />
              </Link>
            }
          />
        </div>

        <div className="p-5 sm:p-6">
          {screens.length === 0 ? (
            <EmptyState
              icon={<CircleSlash size={26} />}
              title="Todavía no hay pantallas registradas"
              description="Abra el reproductor en el televisor, anote el código que muestra y confírmelo desde el centro de pantallas."
              action={
                <ButtonLink href="/admin/pantallas">
                  Ir al centro de pantallas
                </ButtonLink>
              }
            />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {screens.map((s) => (
                <li
                  key={s.id}
                  className="rounded-[14px] border border-ui-border bg-ui-raised p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-extrabold uppercase leading-tight text-inst-blue-top">
                      {s.location || s.name}
                    </p>
                    <Badge tone={s.online ? "ok" : "danger"} dot>
                      {s.online ? "En línea" : "Caída"}
                    </Badge>
                  </div>

                  <p className="ui-tnum mt-1 text-[11px] tracking-widest text-ui-faint">
                    {s.code}
                  </p>

                  <div className="mt-3 border-t border-ui-border pt-3">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-ui-muted">
                      Reproduciendo
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[13px] font-semibold text-ui-ink">
                      {s.currentContentTitle ?? "—"}
                    </p>
                  </div>

                  <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-ui-muted">
                    {!s.online && (
                      <TriangleAlert
                        size={12}
                        className="text-inst-red"
                        aria-hidden
                      />
                    )}
                    Último latido {relativeTime(s.lastSeenAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
