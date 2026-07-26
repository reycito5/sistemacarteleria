import Link from "next/link";
import { ScreenFrame } from "@/components/institutional/ScreenFrame";
import { ViewRenderer, isBareView } from "@/components/views/ViewRenderer";
import { SAMPLE_VIEWS } from "@/lib/views/samples";

export const metadata = {
  title: "Vista previa de plantillas — UABJB Posgrado Digital",
};

const TITLES: Record<string, string> = {
  programacion_general: "Vista 1 · Programación general",
  agenda: "Vista 2 · Agenda académica",
  programa_destacado: "Vista 3 · Programa destacado",
  noticias: "Vista 4 · Noticias y logros",
  comunicado: "Vista 5 · Comunicado importante",
};

/**
 * Galería de plantillas institucionales. Cada tarjeta reproduce el lienzo
 * 1920x1080 escalado dentro de un contenedor 16:9.
 */
export default function PreviewPage() {
  return (
    <div className="min-h-full bg-panel-bg px-6 py-8 text-panel-ink">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-bold text-inst-red">
          ← Inicio
        </Link>
        <h1 className="mt-2 text-3xl font-black text-inst-blue-top">
          Plantillas institucionales
        </h1>
        <p className="mt-1 text-sm text-panel-muted">
          Línea gráfica V11.6 bloqueada: cabecera, pie, colores y tipografía son
          inmutables.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {SAMPLE_VIEWS.map((content, i) => (
            <figure key={i} className="space-y-2">
              <div
                className="aspect-video w-full overflow-hidden rounded-md border shadow-sm"
                style={{ borderColor: "var(--color-panel-border)" }}
              >
                <ScreenFrame bare={isBareView(content)}>
                  <ViewRenderer content={content} />
                </ScreenFrame>
              </div>
              <figcaption className="text-sm font-bold text-inst-blue-top">
                {TITLES[content.kind] ?? content.kind}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
