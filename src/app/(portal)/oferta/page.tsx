import { fetchPortalPrograms } from "@/lib/integration/portalServer";
import { Cifra, NotaAlPie, Contenedor, PortadaRuta } from "@/components/portal/editorial";
import { OfertaFilters } from "./OfertaFilters";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Oferta académica — Vicerrectorado de Posgrado UABJB",
  description:
    "Doctorados, maestrías, especialidades y diplomados del Vicerrectorado de Posgrado de la Universidad Autónoma del Beni «José Ballivián».",
};

export default async function OfertaPublicaPage() {
  const { programs, source } = await fetchPortalPrograms();
  const abiertos = programs.filter((p) => p.status === "abierta").length;

  return (
    <>
      <PortadaRuta
        rotulo="Oferta académica"
        titulo="Programas de posgrado vigentes"
        entradilla="Cuatro niveles de formación —diplomado, especialidad, maestría y doctorado— en modalidades compatibles con el ejercicio profesional."
        pie={
          <div className="grid max-w-lg grid-cols-2 gap-8 border-t border-white/15 pt-8">
            <Cifra
              tono="tinta"
              valor={String(programs.length).padStart(2, "0")}
              glosa="Programas en oferta"
            />
            <Cifra
              tono="tinta"
              valor={String(abiertos).padStart(2, "0")}
              glosa="Con inscripción abierta"
            />
          </div>
        }
      />

      <Contenedor className="py-16 sm:py-24">
        <OfertaFilters programs={programs} />

        {/* El visitante no tiene por qué saber que hay una integración caída,
            pero tampoco puede tomar por definitiva una oferta de muestra. */}
        {source === "muestra" && (
          <NotaAlPie>
            Esta selección es referencial mientras se sincroniza con el portal
            de oferta académica. Confirme cualquier dato con el Vicerrectorado
            antes de iniciar su trámite.
          </NotaAlPie>
        )}
      </Contenedor>
    </>
  );
}
