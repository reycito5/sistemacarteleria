import { Lock, Monitor } from "lucide-react";
import { ScreenFrame } from "@/components/institutional/ScreenFrame";
import { ViewRenderer, screenModeFor } from "@/components/views/ViewRenderer";
import { SAMPLE_VIEWS } from "@/lib/views/samples";
import { VIEW_REGISTRY } from "@/lib/views/registry";
import type { ViewContent } from "@/lib/views/schemas";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = {
  title: "Plantillas institucionales — UABJB Posgrado Digital",
  description:
    "Catálogo de plantillas de cartelería del Vicerrectorado de Posgrado, con la línea gráfica institucional V11.6.",
};

/** Descripción de cuándo conviene usar cada plantilla. */
const PURPOSE: Partial<Record<ViewContent["kind"], string>> = {
  programacion_general:
    "Portada de la oferta académica con el video institucional al lado.",
  agenda: "Actividades del día o de la semana, con hora y lugar.",
  programa_destacado:
    "Ficha completa de un programa: modalidad, duración, créditos y QR.",
  noticias: "Logros, convenios y noticias del Vicerrectorado.",
  comunicado: "Avisos con fecha límite, como el cierre de inscripciones.",
  bienvenida: "Orientación para quien llega: dónde está cada oficina.",
  reconocimientos: "Distinciones a estudiantes, docentes e investigadores.",
  evento_vivo: "Defensas y conferencias que se están celebrando en ese momento.",
  testimonio: "Historias de egresados, con video y frase destacada.",
  mensaje: "Palabra de una autoridad del Vicerrectorado.",
  sincronizacion:
    "Pantalla técnica: aparece sola mientras el equipo descarga la programación.",
  emergencia:
    "Aviso urgente. Se activa desde el panel e interrumpe todo lo demás.",
};

function metaFor(kind: ViewContent["kind"]) {
  return VIEW_REGISTRY.find((v) => v.kind === kind);
}

export default function PreviewPage() {
  return (
    <>
      <section className="ui-gradient-inst-mesh text-inst-white">
        <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-inst-gold">
            Catálogo de vistas
          </p>
          <h1 className="mt-3 max-w-3xl text-[34px] font-black leading-[1.08] sm:text-[46px]">
            Plantillas institucionales
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75">
            Cada pantalla del sistema se construye sobre una de estas plantillas.
            Desde el panel sólo se editan los textos, las fechas y los medios.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold">
              <Lock size={13} className="text-inst-gold" aria-hidden />
              Línea gráfica V11.6 bloqueada
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold">
              <Monitor size={13} className="text-inst-gold" aria-hidden />
              Lienzo 1920×1080 (16:9)
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {SAMPLE_VIEWS.map((content, i) => {
            const meta = metaFor(content.kind);
            return (
              <figure key={i} className="ui-card overflow-hidden p-0">
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <ScreenFrame {...screenModeFor(content)}>
                    <ViewRenderer content={content} />
                  </ScreenFrame>
                </div>
                <figcaption className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-extrabold text-inst-blue-top">
                      {meta?.label ?? content.kind}
                    </h2>
                    {meta && <Badge tone="neutral">Vista {meta.viewNumber}</Badge>}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-ui-muted">
                    {PURPOSE[content.kind] ??
                      "Plantilla institucional del catálogo."}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div className="ui-card mt-10 flex flex-wrap items-center justify-between gap-6 p-8">
          <div className="max-w-xl">
            <h2 className="text-xl font-black text-inst-blue-top sm:text-2xl">
              ¿Quiere crear una pantalla con alguna de estas plantillas?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ui-muted">
              Desde el panel se elige la plantilla, se completan sus campos y se
              ve el resultado en vivo antes de publicarlo.
            </p>
          </div>
          <ButtonLink href="/admin/plantillas">Ir al panel</ButtonLink>
        </div>
      </section>
    </>
  );
}
