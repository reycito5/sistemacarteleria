import { INSTITUTION, INSTITUTIONAL_CONTACTS } from "@/lib/design/tokens";
import { PREGUNTAS_FRECUENTES } from "@/lib/portal/contenido";
import {
  Contenedor,
  CUERPO,
  DATO,
  EncabezadoSeccion,
  EnlaceEditorial,
  PortadaRuta,
  Rotulo,
  ROTULO,
  TITULAR_M,
  TITULAR_S,
} from "@/components/portal/editorial";

export const metadata = {
  title: "Contacto — Vicerrectorado de Posgrado UABJB",
  description:
    "Canales de atención del Vicerrectorado de Posgrado de la Universidad Autónoma del Beni «José Ballivián».",
};

const [whatsapp, telefono] = INSTITUTIONAL_CONTACTS.phones;

/** Canales de atención, ordenados por rapidez de respuesta. */
const CANALES = [
  {
    etiqueta: "WhatsApp",
    numero: whatsapp,
    href: `https://wa.me/591${whatsapp}`,
    externo: true,
    nota: "La vía más rápida para consultas de admisión e inscripción.",
  },
  {
    etiqueta: "Teléfono",
    numero: telefono,
    href: `tel:+591${telefono}`,
    externo: false,
    nota: "Atención directa en horario de oficina.",
  },
];

/** Datos de la oficina, para quien prefiere presentarse en persona. */
const OFICINA = [
  { termino: "Institución", descripcion: INSTITUTION.university },
  { termino: "Unidad", descripcion: INSTITUTION.vicerrectorate },
  { termino: "Atención presencial", descripcion: "Recepción del Vicerrectorado de Posgrado" },
  { termino: "Horario", descripcion: "Lunes a viernes, de 08:00 a 16:00" },
];

export default function ContactoPage() {
  return (
    <>
      <PortadaRuta
        rotulo="Contacto"
        titulo="Estamos para orientarle"
        entradilla="Consultas sobre programas, requisitos de admisión, fechas de inicio y actividades académicas del Vicerrectorado de Posgrado."
      />

      {/* ── Canales ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="canales">
        <Contenedor className="py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
            <div className="lg:pt-3">
              <Rotulo>Canales</Rotulo>
            </div>

            <div>
              <h2 id="canales" className="sr-only">
                Canales de atención
              </h2>

              <ul className="border-t border-sig-rule">
                {CANALES.map((canal) => (
                  <li
                    key={canal.etiqueta}
                    className="grid gap-x-12 gap-y-4 border-b border-sig-rule py-10 lg:grid-cols-[minmax(0,1fr)_22rem]"
                  >
                    <div>
                      <p className={`${ROTULO} text-sig-text-soft`}>
                        {canal.etiqueta}
                      </p>
                      {/* El número es la información: se compone a tamaño de
                          titular, en monoespaciada, para poder leerse y
                          teclearse de un vistazo. */}
                      <a
                        href={canal.href}
                        {...(canal.externo
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                        className={`${DATO} mt-4 block text-[clamp(2.25rem,5.5vw,3.5rem)] font-semibold leading-none text-brand-ink transition-colors hover:text-brand-red`}
                      >
                        {canal.numero}
                      </a>
                    </div>
                    <p
                      className={`self-end text-sig-text-soft ${CUERPO} lg:text-right`}
                    >
                      {canal.nota}
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-2">
                {OFICINA.map((dato) => (
                  <div key={dato.termino}>
                    <dt className={`${ROTULO} text-brand-red`}>
                      {dato.termino}
                    </dt>
                    <dd className="mt-2.5 text-[15px] leading-[1.7] text-sig-text-soft">
                      {dato.descripcion}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Contenedor>
      </section>

      {/* ── Preguntas frecuentes ────────────────────────────────────────── */}
      <section
        aria-labelledby="preguntas"
        className="border-y border-sig-rule bg-sig-paper-2"
      >
        <Contenedor className="py-16 sm:py-24">
          <EncabezadoSeccion
            rotulo="Preguntas"
            titulo={<span id="preguntas">Lo que más nos consultan</span>}
          />

          <ul className="mt-14 border-t border-sig-rule">
            {PREGUNTAS_FRECUENTES.map((item, i) => (
              <li
                key={item.pregunta}
                className="grid gap-x-12 gap-y-4 border-b border-sig-rule py-9 lg:grid-cols-[3rem_24rem_minmax(0,1fr)]"
              >
                <p className={`${DATO} text-[13px] text-brand-red`}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className={`text-pretty text-brand-ink ${TITULAR_S}`}>
                  {item.pregunta}
                </h3>
                <p className="max-w-[58ch] text-[15px] leading-[1.75] text-sig-text-soft">
                  {item.respuesta}
                </p>
              </li>
            ))}
          </ul>
        </Contenedor>
      </section>

      {/* ── Cierre ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="siguiente">
        <Contenedor className="py-16 sm:py-24">
          <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
            <div className="lg:pt-3">
              <Rotulo>Antes de escribir</Rotulo>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8">
              <h2
                id="siguiente"
                className={`max-w-[24ch] flex-1 basis-[26rem] text-balance text-brand-ink ${TITULAR_M}`}
              >
                Quizá encuentre lo que busca en la oferta o en la agenda.
              </h2>
              <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                <EnlaceEditorial href="/oferta">
                  Oferta académica
                </EnlaceEditorial>
                <EnlaceEditorial href="/agenda">Agenda</EnlaceEditorial>
              </div>
            </div>
          </div>
        </Contenedor>
      </section>
    </>
  );
}
