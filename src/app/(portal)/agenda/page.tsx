import { CalendarDays, MapPin } from "lucide-react";
import { getPublicAgenda, type AgendaEntry } from "@/lib/data/publicAgenda";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Agenda académica — UABJB Posgrado Digital",
  description:
    "Defensas de tesis, conferencias y actividades del Vicerrectorado de Posgrado de la UABJB.",
};

/** Agrupa las actividades por fecha, conservando el orden recibido. */
function groupByDate(entries: AgendaEntry[]): [string, AgendaEntry[]][] {
  const groups = new Map<string, AgendaEntry[]>();
  for (const entry of entries) {
    const key = entry.date || "Sin fecha";
    groups.set(key, [...(groups.get(key) ?? []), entry]);
  }
  return [...groups.entries()];
}

export default async function AgendaPage() {
  const { entries, source } = await getPublicAgenda();
  const groups = groupByDate(entries);

  return (
    <>
      <section className="ui-gradient-inst-mesh text-brand-white">
        <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-red">
            Vicerrectorado de Posgrado
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-[36px] font-semibold leading-[1.1] sm:text-[50px]">
            Agenda académica
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75">
            Defensas de tesis, presentaciones de proyecto y conferencias. Es la
            misma agenda que se emite en las pantallas del Vicerrectorado.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 sm:py-16">
        {source === "muestra" && (
          <Alert tone="warn" className="mb-8" title="Agenda de ejemplo">
            Todavía no hay contenidos de tipo «Agenda académica» aprobados en el
            panel. En cuanto se apruebe el primero, esta página mostrará las
            actividades reales.
          </Alert>
        )}

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-brand-ink">
            {entries.length} actividad{entries.length === 1 ? "" : "es"}{" "}
            programada{entries.length === 1 ? "" : "s"}
          </h2>
          <Badge tone={source === "contenido" ? "ok" : "warn"} dot>
            {source === "contenido" ? "Agenda publicada" : "Datos de muestra"}
          </Badge>
        </div>

        {entries.length === 0 ? (
          <EmptyState
            icon={<CalendarDays size={26} />}
            title="No hay actividades programadas"
            description="Vuelva a consultar más adelante o comuníquese con el Vicerrectorado."
          />
        ) : (
          <div className="space-y-8">
            {groups.map(([date, items]) => (
              <div key={date}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-brand-ink-deep text-brand-white">
                    <CalendarDays size={18} aria-hidden />
                  </span>
                  <h3 className="text-lg font-extrabold text-brand-ink">
                    {date}
                  </h3>
                  <span className="h-px flex-1 bg-ui-border" aria-hidden />
                  <span className="text-xs font-semibold text-ui-muted">
                    {items.length} actividad{items.length === 1 ? "" : "es"}
                  </span>
                </div>

                <ul className="space-y-3">
                  {items.map((entry, i) => (
                    <li
                      key={`${date}-${i}`}
                      className="ui-card flex flex-wrap items-center gap-x-6 gap-y-3 p-5 transition hover:border-brand-ink-soft/30"
                    >
                      {entry.time && (
                        <span className="ui-tnum shrink-0 rounded-[10px] bg-info-soft px-3.5 py-2 text-lg font-black text-brand-ink">
                          {entry.time}
                        </span>
                      )}

                      <div className="min-w-[200px] flex-1">
                        <p className="font-serif text-[17px] font-semibold leading-snug text-brand-ink">
                          {entry.title}
                        </p>
                        {entry.place && (
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ui-muted">
                            <MapPin size={13} className="text-brand-red" aria-hidden />
                            {entry.place}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="ui-card mt-12 flex flex-wrap items-center justify-between gap-6 p-8">
          <div className="max-w-xl">
            <h2 className="text-xl font-black text-brand-ink sm:text-2xl">
              ¿Quiere anunciar una actividad en las pantallas?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ui-muted">
              Desde el panel se crea un contenido con la plantilla «Agenda
              académica»; al aprobarlo aparece aquí y en los televisores.
            </p>
          </div>
          <ButtonLink href="/admin/plantillas">Ir al panel</ButtonLink>
        </div>
      </section>
    </>
  );
}
