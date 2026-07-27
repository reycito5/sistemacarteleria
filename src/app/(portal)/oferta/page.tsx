import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  GraduationCap,
  Layers,
} from "lucide-react";
import { fetchPortalPrograms } from "@/lib/integration/portalServer";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Oferta académica — UABJB Posgrado Digital",
  description:
    "Programas de posgrado del Vicerrectorado de Posgrado de la Universidad Autónoma del Beni «José Ballivián».",
};

export default async function OfertaPublicaPage() {
  const { programs, source } = await fetchPortalPrograms();

  return (
    <>
      <section className="ui-gradient-inst-mesh text-inst-white">
        <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-inst-gold">
            Vicerrectorado de Posgrado
          </p>
          <h1 className="mt-3 max-w-3xl text-[34px] font-black leading-[1.08] sm:text-[46px]">
            Oferta académica de Posgrado
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75">
            La misma oferta que se emite en las pantallas del Vicerrectorado.
            Cada programa puede convertirse en una pantalla «Programa destacado»
            desde el panel de administración.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 sm:py-16">
        {source === "muestra" && (
          <Alert
            tone="warn"
            className="mb-8"
            title="Mostrando una oferta de ejemplo"
          >
            El portal de oferta académica todavía no está conectado. Configure la
            variable <code>OFERTA_PORTAL_URL</code> para que esta página y las
            pantallas usen los programas reales.
          </Alert>
        )}

        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-black text-inst-blue-top">
            {programs.length} programa{programs.length === 1 ? "" : "s"}{" "}
            disponible{programs.length === 1 ? "" : "s"}
          </h2>
          <Badge tone={source === "portal" ? "ok" : "warn"} dot>
            {source === "portal" ? "Datos del portal" : "Datos de muestra"}
          </Badge>
        </div>

        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <li
              key={p.id}
              className="ui-card flex flex-col p-0 transition hover:-translate-y-1 hover:border-inst-blue/30 hover:shadow-[var(--shadow-ui-lg)]"
            >
              <div className="ui-gradient-inst px-5 py-4">
                <Badge
                  tone={p.enrollmentOpen ? "ok" : "neutral"}
                  className="bg-white/95"
                >
                  {p.enrollmentOpen ? "Inscripciones abiertas" : "Próximamente"}
                </Badge>
                <h3 className="mt-3 text-lg font-black leading-snug text-inst-white">
                  {p.name}
                </h3>
              </div>

              <div className="flex flex-1 flex-col p-5">
                {p.slogan && (
                  <p className="text-sm italic leading-relaxed text-ui-muted">
                    “{p.slogan}”
                  </p>
                )}

                <dl className="mt-4 space-y-2.5 text-sm">
                  {p.modality && (
                    <div className="flex items-center gap-2.5">
                      <Layers size={15} className="text-inst-gold" aria-hidden />
                      <dt className="sr-only">Modalidad</dt>
                      <dd className="font-semibold text-ui-ink">{p.modality}</dd>
                    </div>
                  )}
                  {p.startDate && (
                    <div className="flex items-center gap-2.5">
                      <CalendarDays
                        size={15}
                        className="text-inst-gold"
                        aria-hidden
                      />
                      <dt className="sr-only">Inicio</dt>
                      <dd className="text-ui-muted">Inicio: {p.startDate}</dd>
                    </div>
                  )}
                  {p.durationMonths && (
                    <div className="flex items-center gap-2.5">
                      <Clock size={15} className="text-inst-gold" aria-hidden />
                      <dt className="sr-only">Duración</dt>
                      <dd className="text-ui-muted">
                        {p.durationMonths} meses
                        {p.hours ? ` · ${p.hours} horas` : ""}
                      </dd>
                    </div>
                  )}
                  {p.credits && (
                    <div className="flex items-center gap-2.5">
                      <GraduationCap
                        size={15}
                        className="text-inst-gold"
                        aria-hidden
                      />
                      <dt className="sr-only">Créditos</dt>
                      <dd className="text-ui-muted">{p.credits} créditos</dd>
                    </div>
                  )}
                </dl>

                {p.enrollmentUrl && (
                  <ButtonLink
                    href={p.enrollmentUrl}
                    target="_blank"
                    variant="secondary"
                    size="sm"
                    block
                    className="mt-5"
                  >
                    {p.enrollmentOpen ? "Inscribirse" : "Ver el programa"}
                    <ArrowUpRight size={14} aria-hidden />
                  </ButtonLink>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
