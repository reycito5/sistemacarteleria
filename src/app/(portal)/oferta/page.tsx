import { fetchPortalPrograms } from "@/lib/integration/portalServer";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { OfertaFilters } from "./OfertaFilters";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Oferta académica — UABJB Posgrado Digital",
  description:
    "Programas de posgrado del Vicerrectorado de Posgrado de la Universidad Autónoma del Beni «José Ballivián».",
};

export default async function OfertaPublicaPage() {
  const { programs, source } = await fetchPortalPrograms();
  const open = programs.filter((p) => p.status === "abierta").length;

  return (
    <>
      <section className="ui-gradient-inst-mesh text-brand-white">
        <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-red">
            Vicerrectorado de Posgrado
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-[36px] font-semibold leading-[1.1] sm:text-[50px]">
            Oferta académica de Posgrado
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75">
            La misma oferta que se emite en las pantallas del Vicerrectorado.
            Cada programa puede convertirse en una pantalla «Programa destacado»
            desde el panel de administración.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-semibold">
              <strong className="text-brand-red">{programs.length}</strong>{" "}
              programa{programs.length === 1 ? "" : "s"} en total
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-semibold">
              <strong className="text-brand-red">{open}</strong> con inscripción
              abierta
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 sm:py-16">
        {source === "muestra" && (
          <Alert
            tone="warn"
            className="mb-8"
            title="Mostrando una oferta de ejemplo"
          >
            El portal de oferta académica todavía no responde. Revise la
            conexión en <strong>Panel → Portal de oferta</strong>: allí se ve
            qué ruta se probó y qué devolvió.
          </Alert>
        )}

        <div className="mb-8 flex flex-wrap items-center justify-end">
          <Badge tone={source === "portal" ? "ok" : "warn"} dot>
            {source === "portal" ? "Datos del portal" : "Datos de muestra"}
          </Badge>
        </div>

        <OfertaFilters programs={programs} />
      </section>
    </>
  );
}
