import { getPublicAgenda, type AgendaEntry } from "@/lib/data/publicAgenda";
import {
  Cifra,
  Contenedor,
  CUERPO,
  DATO,
  EnlaceEditorial,
  NotaAlPie,
  PortadaRuta,
  ROTULO,
  TITULAR_M,
  TITULAR_S,
} from "@/components/portal/editorial";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Agenda académica — Vicerrectorado de Posgrado UABJB",
  description:
    "Defensas de tesis, conferencias y actos académicos del Vicerrectorado de Posgrado de la UABJB.",
};

/** Agrupa las actividades por fecha, conservando el orden recibido. */
function agruparPorFecha(entries: AgendaEntry[]): [string, AgendaEntry[]][] {
  const grupos = new Map<string, AgendaEntry[]>();
  for (const entrada of entries) {
    const clave = entrada.date || "Sin fecha";
    grupos.set(clave, [...(grupos.get(clave) ?? []), entrada]);
  }
  return [...grupos.entries()];
}

export default async function AgendaPage() {
  const { entries, source } = await getPublicAgenda();
  const grupos = agruparPorFecha(entries);

  return (
    <>
      <PortadaRuta
        rotulo="Agenda académica"
        titulo="Defensas, conferencias y actos abiertos"
        entradilla="Las actividades del Vicerrectorado de Posgrado son públicas. Esta es la misma agenda que se anuncia en las pantallas del edificio."
        pie={
          <div className="grid max-w-lg grid-cols-2 gap-8 border-t border-white/15 pt-8">
            <Cifra
              tono="tinta"
              valor={String(entries.length).padStart(2, "0")}
              glosa="Actividades programadas"
            />
            <Cifra
              tono="tinta"
              valor={String(grupos.length).padStart(2, "0")}
              glosa="Jornadas con actividad"
            />
          </div>
        }
      />

      <Contenedor className="py-16 sm:py-24">
        {entries.length === 0 ? (
          <div className="max-w-[44rem]">
            <h2 className={`max-w-[22ch] text-brand-ink ${TITULAR_M}`}>
              No hay actividades programadas por ahora.
            </h2>
            <p className={`mt-5 max-w-[54ch] text-sig-text-soft ${CUERPO}`}>
              Vuelva a consultar esta página en unos días o comuníquese con el
              Vicerrectorado para conocer el calendario de defensas.
            </p>
            <div className="mt-8">
              <EnlaceEditorial href="/contacto">
                Formas de contacto
              </EnlaceEditorial>
            </div>
          </div>
        ) : (
          <div className="space-y-16 sm:space-y-20">
            {grupos.map(([fecha, actividades]) => (
              <section key={fecha} className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
                {/* La fecha queda en el margen y acompaña a su bloque durante
                    el desplazamiento, como el folio de un programa impreso. */}
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <h2
                    className={`${DATO} text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-none text-brand-ink`}
                  >
                    {fecha}
                  </h2>
                  <p className={`mt-3 ${ROTULO} text-sig-text-soft`}>
                    {actividades.length} actividad
                    {actividades.length === 1 ? "" : "es"}
                  </p>
                </div>

                <ul className="border-t border-sig-rule">
                  {actividades.map((actividad, i) => (
                    <li
                      key={`${fecha}-${i}`}
                      className="grid gap-x-10 gap-y-2 border-b border-sig-rule py-7 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
                    >
                      <p
                        className={`${DATO} text-[15px] font-semibold text-brand-red sm:pt-1`}
                      >
                        {actividad.time || "—"}
                      </p>
                      <div className="min-w-0">
                        <h3 className={`text-pretty text-brand-ink ${TITULAR_S}`}>
                          {actividad.title}
                        </h3>
                        {actividad.place && (
                          <p className="mt-2.5 text-[12px] uppercase tracking-[0.16em] text-sig-text-soft">
                            {actividad.place}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        {source === "muestra" && entries.length > 0 && (
          <NotaAlPie>
            Programación de referencia. Confirme fecha, hora y sala con el
            Vicerrectorado antes de asistir.
          </NotaAlPie>
        )}
      </Contenedor>
    </>
  );
}
