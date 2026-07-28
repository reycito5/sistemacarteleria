import { INSTITUTION } from "@/lib/design/tokens";
import { fetchPortalPrograms } from "@/lib/integration/portalServer";
import { getPublicAgenda } from "@/lib/data/publicAgenda";
import { PUNTOS_CARTELERIA } from "@/lib/portal/contenido";
import { ProgramCard } from "@/components/portal/ProgramCard";
import {
  CampoTinta,
  Cifra,
  Contenedor,
  CUERPO,
  DATO,
  ENTRADILLA,
  EncabezadoSeccion,
  EnlaceEditorial,
  Rotulo,
  TITULAR_M,
  TITULAR_S,
  TITULAR_XL,
} from "@/components/portal/editorial";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Vicerrectorado de Posgrado — UABJB",
  description:
    "Formación de cuarto nivel de la Universidad Autónoma del Beni «José Ballivián»: doctorados, maestrías, especialidades y diplomados.",
};

export default async function PortalHome() {
  // La portada presenta la institución con datos vivos —oferta y agenda— en
  // lugar de explicar el sistema que hay detrás.
  const [{ programs }, { entries }] = await Promise.all([
    fetchPortalPrograms(),
    getPublicAgenda(),
  ]);

  const abiertos = programs.filter((p) => p.status === "abierta");
  // Se destacan primero los programas con inscripción abierta: es la
  // información accionable para quien llega al portal.
  const destacados = [
    ...abiertos,
    ...programs.filter((p) => p.status !== "abierta"),
  ].slice(0, 3);
  const proximas = entries.slice(0, 4);

  return (
    <>
      {/* ── Portada ─────────────────────────────────────────────────────── */}
      <CampoTinta>
        <Contenedor className="pb-16 pt-16 sm:pb-24 sm:pt-24 lg:pb-28 lg:pt-28">
          <Rotulo tono="tinta">{INSTITUTION.vicerrectorate}</Rotulo>

          <h1 className={`mt-8 max-w-[15ch] text-balance ${TITULAR_XL}`}>
            Formación de cuarto nivel{" "}
            <em className="not-italic text-brand-red">
              al servicio del Beni
            </em>
            .
          </h1>

          <p className={`mt-8 max-w-[52ch] text-white/80 ${ENTRADILLA}`}>
            Doctorados, maestrías, especialidades y diplomados de la
            Universidad Autónoma del Beni «José Ballivián», pensados para
            quienes ya ejercen su profesión en el departamento.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
            <EnlaceEditorial href="/oferta" tono="tinta">
              Ver la oferta académica
            </EnlaceEditorial>
            <EnlaceEditorial href="/agenda" tono="tinta">
              Agenda de actividades
            </EnlaceEditorial>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/15 pt-10 sm:mt-20 lg:grid-cols-4">
            <Cifra
              tono="tinta"
              valor={String(programs.length).padStart(2, "0")}
              glosa="Programas en oferta"
            />
            <Cifra
              tono="tinta"
              valor={String(abiertos.length).padStart(2, "0")}
              glosa="Con inscripción abierta"
            />
            <Cifra
              tono="tinta"
              valor={String(entries.length).padStart(2, "0")}
              glosa="Actividades en agenda"
            />
            <Cifra
              tono="tinta"
              valor={String(PUNTOS_CARTELERIA.length).padStart(2, "0")}
              glosa="Puntos de información"
            />
          </div>
        </Contenedor>
      </CampoTinta>

      {/* ── Presentación ────────────────────────────────────────────────── */}
      <section aria-labelledby="presentacion">
        <Contenedor className="py-20 sm:py-28">
          <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
            <div className="lg:pt-3">
              <Rotulo>Presentación</Rotulo>
            </div>

            <div className="max-w-[48rem]">
              <h2
                id="presentacion"
                className={`max-w-[20ch] text-balance text-brand-ink ${TITULAR_M}`}
              >
                El Vicerrectorado conduce la formación de posgrado de la
                universidad pública del Beni.
              </h2>

              {/* Dos columnas de lectura en pantalla ancha: da densidad de
                  impreso sin alargar la línea más allá de lo legible. */}
              <div
                className={`mt-8 text-sig-text-soft ${CUERPO} sm:columns-2 sm:gap-12 [&>p]:mb-6 [&>p:last-child]:mb-0`}
              >
                <p>
                  Diseña los programas, acompaña a los postulantes durante el
                  trámite de admisión y respalda los títulos que la universidad
                  otorga. Su oferta se organiza en cuatro niveles —diplomado,
                  especialidad, maestría y doctorado— y se dicta en modalidades
                  compatibles con el ejercicio profesional.
                </p>
                <p>
                  Las defensas de tesis, las conferencias y los actos académicos
                  son abiertos: se anuncian en la agenda y en las pantallas del
                  edificio, y cualquier persona interesada puede asistir a los
                  que se celebran en el auditorio del Vicerrectorado.
                </p>
              </div>
            </div>
          </div>
        </Contenedor>
      </section>

      {/* ── Oferta destacada ────────────────────────────────────────────── */}
      {destacados.length > 0 && (
        <section
          aria-labelledby="oferta-destacada"
          className="border-y border-sig-rule bg-sig-paper-2"
        >
          <Contenedor className="py-20 sm:py-28">
            <EncabezadoSeccion
              rotulo="Oferta académica"
              titulo={
                <span id="oferta-destacada">
                  Cuatro niveles de formación, una misma exigencia.
                </span>
              }
              entradilla="Una selección de la oferta vigente. La ficha de cada programa detalla modalidad, duración, créditos y fecha de inicio."
              acciones={
                <EnlaceEditorial href="/oferta">
                  Ver los {programs.length} programas
                </EnlaceEditorial>
              }
            />

            <ul className="mt-14 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {destacados.map((programa) => (
                <li key={programa.id}>
                  <ProgramCard program={programa} />
                </li>
              ))}
            </ul>
          </Contenedor>
        </section>
      )}

      {/* ── Agenda ──────────────────────────────────────────────────────── */}
      {proximas.length > 0 && (
        <section aria-labelledby="agenda-proxima">
          <Contenedor className="py-20 sm:py-28">
            <EncabezadoSeccion
              rotulo="Agenda"
              titulo={
                <span id="agenda-proxima">Lo próximo en el Vicerrectorado</span>
              }
              acciones={
                <EnlaceEditorial href="/agenda">Agenda completa</EnlaceEditorial>
              }
            />

            <ul className="mt-12 border-t border-sig-rule">
              {proximas.map((actividad, i) => (
                <li
                  key={`${actividad.date}-${actividad.title}-${i}`}
                  className="grid gap-x-12 gap-y-3 border-b border-sig-rule py-7 lg:grid-cols-[15rem_minmax(0,1fr)_12rem]"
                >
                  <p
                    className={`${DATO} text-[13px] uppercase tracking-[0.12em] text-brand-red`}
                  >
                    {actividad.date}
                    {actividad.time && (
                      <>
                        <span aria-hidden className="px-2 text-sig-rule">
                          /
                        </span>
                        {actividad.time}
                      </>
                    )}
                  </p>
                  <p
                    className={`text-pretty text-brand-ink ${TITULAR_S} lg:text-[1.25rem]`}
                  >
                    {actividad.title}
                  </p>
                  {actividad.place && (
                    <p className="text-[13px] uppercase tracking-[0.12em] text-sig-text-soft lg:text-right">
                      {actividad.place}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </Contenedor>
        </section>
      )}

      {/* ── Cartelería ──────────────────────────────────────────────────── */}
      <section aria-labelledby="carteleria">
        <CampoTinta>
          <Contenedor className="py-20 sm:py-28">
            <EncabezadoSeccion
              tono="tinta"
              rotulo="Cartelería institucional"
              titulo={
                <span id="carteleria">
                  Cuatro puntos de información dentro del edificio.
                </span>
              }
              entradilla="La oferta, la agenda y los avisos del Vicerrectorado también se publican en pantalla, en los lugares por donde pasa la comunidad académica."
              acciones={
                <EnlaceEditorial href="/pantallas" tono="tinta">
                  Conocer la cartelería
                </EnlaceEditorial>
              }
            />

            <ul className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {PUNTOS_CARTELERIA.map((punto, i) => (
                <li key={punto.codigo} className="border-t border-white/20 pt-5">
                  <p
                    className={`${DATO} text-[12px] tracking-[0.16em] text-white/60`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-4 font-serif text-[22px] font-semibold leading-tight tracking-[-0.01em] text-white">
                    {punto.nombre}
                  </p>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/70">
                    {punto.lugar}
                  </p>
                </li>
              ))}
            </ul>
          </Contenedor>
        </CampoTinta>
      </section>

      {/* ── Contacto ────────────────────────────────────────────────────── */}
      <section aria-labelledby="contacto-portada">
        <Contenedor className="py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
            <div className="lg:pt-3">
              <Rotulo>Contacto</Rotulo>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
              <div className="min-w-0 flex-1 basis-[26rem]">
                <h2
                  id="contacto-portada"
                  className={`max-w-[22ch] text-balance text-brand-ink ${TITULAR_M}`}
                >
                  ¿Necesita orientación sobre un programa?
                </h2>
                <p className={`mt-5 max-w-[52ch] text-sig-text-soft ${CUERPO}`}>
                  Atendemos consultas sobre admisión, requisitos y fechas de
                  inicio de lunes a viernes, de 08:00 a 16:00.
                </p>
              </div>
              <div className="shrink-0">
                <EnlaceEditorial href="/contacto">
                  Formas de contacto
                </EnlaceEditorial>
              </div>
            </div>
          </div>
        </Contenedor>
      </section>
    </>
  );
}
