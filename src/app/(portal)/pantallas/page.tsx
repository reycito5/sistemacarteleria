import { ScreenFrame } from "@/components/institutional/ScreenFrame";
import { ViewRenderer, screenModeFor } from "@/components/views/ViewRenderer";
import { SAMPLE_VIEWS } from "@/lib/views/samples";
import { PUNTOS_CARTELERIA, QUE_COMUNICA, VISTAS_PUBLICAS } from "@/lib/portal/contenido";
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
  title: "Cartelería institucional — Vicerrectorado de Posgrado UABJB",
  description:
    "Los cuatro puntos de información del Vicerrectorado de Posgrado y lo que se anuncia en ellos.",
};

/**
 * Muestras de pantalla que se enseñan al público, en el orden en que están
 * declaradas. Se resuelven contra `SAMPLE_VIEWS` con `flatMap` para que el
 * tipo quede estrecho sin recurrir a aserciones.
 */
const VISTAS = VISTAS_PUBLICAS.flatMap((kind) => {
  const vista = SAMPLE_VIEWS.find((v) => v.kind === kind);
  return vista ? [vista] : [];
});

export default function CarteleriaPage() {
  return (
    <>
      <PortadaRuta
        rotulo="Cartelería institucional"
        titulo="Lo que se anuncia dentro del Vicerrectorado"
        entradilla="Cuatro pantallas reparten la misma información en los lugares por donde pasa la comunidad académica: la oferta vigente, la agenda del día y los avisos de la institución."
      />

      {/* ── Dónde verla ─────────────────────────────────────────────────── */}
      <section aria-labelledby="puntos">
        <Contenedor className="py-16 sm:py-24">
          <EncabezadoSeccion
            rotulo="Dónde verla"
            titulo={<span id="puntos">Cuatro puntos de información</span>}
            entradilla="Todas emiten el mismo contenido al mismo tiempo, de modo que la información no depende de por dónde se entre al edificio."
          />

          <ul className="mt-14 border-t border-sig-rule">
            {PUNTOS_CARTELERIA.map((punto, i) => (
              <li
                key={punto.codigo}
                className="grid gap-x-10 gap-y-3 border-b border-sig-rule py-8 sm:grid-cols-[3rem_minmax(0,1fr)] lg:grid-cols-[3rem_16rem_minmax(0,1fr)_14rem]"
              >
                <p className={`${DATO} text-[13px] text-brand-red`}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className={`text-brand-ink ${TITULAR_S}`}>{punto.nombre}</h3>
                <p className={`text-sig-text-soft ${CUERPO}`}>{punto.lugar}</p>
                <p className={`${ROTULO} text-sig-text-soft lg:text-right`}>
                  {punto.publico}
                </p>
              </li>
            ))}
          </ul>
        </Contenedor>
      </section>

      {/* ── Qué se anuncia ──────────────────────────────────────────────── */}
      <section
        aria-labelledby="que-se-anuncia"
        className="border-y border-sig-rule bg-sig-paper-2"
      >
        <Contenedor className="py-16 sm:py-24">
          <EncabezadoSeccion
            rotulo="Qué se anuncia"
            titulo={
              <span id="que-se-anuncia">
                Ocho maneras de contar lo mismo: lo que hace el Vicerrectorado.
              </span>
            }
            entradilla="Cada pantalla se compone sobre la línea gráfica institucional, con la misma tipografía y los mismos colores que este portal."
          />

          <div className="mt-14 grid gap-x-10 gap-y-16 lg:grid-cols-2">
            {VISTAS.map((contenido) => {
              const glosa = QUE_COMUNICA[contenido.kind];
              return (
                <figure key={contenido.kind}>
                  {/* El lienzo del televisor es siempre 16:9; el marco fino de
                      tinta lo presenta como una lámina, no como una tarjeta. */}
                  <div className="relative aspect-video w-full overflow-hidden border border-brand-ink/15 bg-black">
                    <ScreenFrame {...screenModeFor(contenido)}>
                      <ViewRenderer content={contenido} />
                    </ScreenFrame>
                  </div>
                  <figcaption className="mt-5 border-t border-sig-rule pt-5">
                    <h3 className={`text-brand-ink ${TITULAR_S}`}>
                      {glosa?.titulo ?? "Pantalla institucional"}
                    </h3>
                    {glosa?.texto && (
                      <p className="mt-2.5 max-w-[52ch] text-[15px] leading-[1.7] text-sig-text-soft">
                        {glosa.texto}
                      </p>
                    )}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </Contenedor>
      </section>

      {/* ── Cierre ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="anunciar">
        <Contenedor className="py-16 sm:py-24">
          <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
            <div className="lg:pt-3">
              <Rotulo>Anunciar</Rotulo>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
              <div className="min-w-0 flex-1 basis-[26rem]">
                <h2
                  id="anunciar"
                  className={`max-w-[22ch] text-balance text-brand-ink ${TITULAR_M}`}
                >
                  ¿Tiene una actividad académica para anunciar?
                </h2>
                <p className={`mt-5 max-w-[54ch] text-sig-text-soft ${CUERPO}`}>
                  Comuníquela al Vicerrectorado con al menos dos días de
                  antelación, indicando fecha, hora y sala. Se publicará en la
                  agenda del portal y en las cuatro pantallas.
                </p>
              </div>
              <div className="shrink-0">
                <EnlaceEditorial href="/contacto">
                  Comunicar una actividad
                </EnlaceEditorial>
              </div>
            </div>
          </div>
        </Contenedor>
      </section>
    </>
  );
}
