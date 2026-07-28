import { ScreenFrame } from "@/components/institutional/ScreenFrame";
import { ViewRenderer, screenModeFor } from "@/components/views/ViewRenderer";
import { SAMPLE_VIEWS } from "@/lib/views/samples";
import { VIEW_REGISTRY } from "@/lib/views/registry";
import type { ViewContent } from "@/lib/views/schemas";
import { PROPOSITO_PLANTILLA } from "@/lib/portal/contenido";
import {
  Contenedor,
  DATO,
  PortadaRuta,
  TITULAR_S,
} from "@/components/portal/editorial";

export const metadata = {
  title: "Catálogo de plantillas — Referencia interna",
  description:
    "Catálogo completo de plantillas institucionales de cartelería, incluidas las técnicas.",
  robots: { index: false, follow: false },
};

function metaDe(kind: ViewContent["kind"]) {
  return VIEW_REGISTRY.find((v) => v.kind === kind);
}

/**
 * Catálogo completo de plantillas.
 *
 * Esta ruta no está en la navegación pública: es la referencia que consulta
 * quien administra la cartelería —el panel enlaza aquí desde «Plantillas» y
 * desde la ayuda— e incluye también las vistas técnicas (sincronización, sin
 * conexión, mantenimiento, emergencia), que al visitante no le dicen nada. La
 * versión pública, ya filtrada y redactada para el lector, vive en
 * `/pantallas`.
 */
export default function PreviewPage() {
  return (
    <>
      <PortadaRuta
        rotulo="Referencia interna"
        titulo="Catálogo de plantillas"
        entradilla="Las dieciséis vistas institucionales sobre las que se construye cada pantalla del sistema, con su numeración de línea gráfica. Desde el panel sólo se editan sus textos, sus fechas y sus medios."
      />

      <Contenedor className="py-16 sm:py-24">
        <div className="grid gap-x-10 gap-y-16 lg:grid-cols-2">
          {SAMPLE_VIEWS.map((contenido, i) => {
            const meta = metaDe(contenido.kind);
            return (
              <figure key={`${contenido.kind}-${i}`}>
                <div className="relative aspect-video w-full overflow-hidden border border-brand-ink/15 bg-black">
                  <ScreenFrame {...screenModeFor(contenido)}>
                    <ViewRenderer content={contenido} />
                  </ScreenFrame>
                </div>
                <figcaption className="mt-5 border-t border-sig-rule pt-5">
                  <div className="flex items-baseline gap-4">
                    <span
                      className={`${DATO} shrink-0 text-[13px] text-brand-red`}
                    >
                      {String(meta?.viewNumber ?? i + 1).padStart(2, "0")}
                    </span>
                    <h2 className={`text-brand-ink ${TITULAR_S}`}>
                      {meta?.label ?? contenido.kind}
                    </h2>
                  </div>
                  <p className="mt-2.5 max-w-[54ch] pl-[2.25rem] text-[15px] leading-[1.7] text-sig-text-soft">
                    {PROPOSITO_PLANTILLA[contenido.kind] ??
                      "Plantilla institucional del catálogo."}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Contenedor>
    </>
  );
}
