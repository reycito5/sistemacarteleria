import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Gramática visual del portal institucional.
 *
 * El portal es la cara del Vicerrectorado, no una aplicación: por eso su
 * repertorio no son tarjetas sino recursos de imprenta —rótulo, titular en
 * serif, entradilla, filete—. Centralizarlos aquí es lo que hace que las
 * cinco rutas se lean como un mismo impreso y no como cinco plantillas.
 *
 * Nota de color: el portal viste el papel cálido de la línea gráfica
 * institucional (`sig-paper`), el mismo que se ve en el televisor, en lugar
 * del gris frío del panel (`ui-canvas`). Es deliberado: quien entra debe
 * reconocer la institución, no el sistema que hay detrás.
 */

/* ==========================================================================
 * Escalas tipográficas
 * --------------------------------------------------------------------------
 * Fraunces se usa siempre en peso 600: a tamaños de titular, el peso negro
 * empasta los remates y pierde el aire editorial que buscamos. El contraste
 * fuerte lo da el salto de tamaño y el interlineado cerrado, no el grosor.
 * ======================================================================== */

/** Titular de portada de inicio. */
export const TITULAR_XL =
  "font-serif text-[clamp(2.5rem,7.2vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.025em]";

/** Titular de portada de ruta interior. */
export const TITULAR_L =
  "font-serif text-[clamp(2.125rem,5.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.02em]";

/** Titular de sección. */
export const TITULAR_M =
  "font-serif text-[clamp(1.75rem,3.6vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.015em]";

/** Titular menor: nombre de programa, pregunta frecuente, pie de figura. */
export const TITULAR_S =
  "font-serif text-[clamp(1.125rem,1.9vw,1.5rem)] font-semibold leading-[1.2] tracking-[-0.01em]";

/** Entradilla: el párrafo que sostiene al titular. */
export const ENTRADILLA =
  "font-serif text-[clamp(1.0625rem,1.7vw,1.375rem)] font-normal leading-[1.55]";

/** Cuerpo de texto corrido. */
export const CUERPO = "text-[15px] leading-[1.75] sm:text-base";

/** Rótulo: versalita de sistema que ordena la página. */
export const ROTULO =
  "text-[11px] font-semibold uppercase tracking-[0.24em] sm:text-[12px]";

/** Dato monoespaciado: horas, fechas, teléfonos, cifras. */
export const DATO = "font-mono ui-tnum tabular-nums";

/**
 * Foco sobre campo de tinta. El anillo global es azul institucional y sobre el
 * azul profundo del fondo resultaría invisible, así que en esas zonas se
 * repinta en blanco. La regla global usa `:where()`, de especificidad cero, de
 * modo que basta con esta clase para ganarle.
 */
export const FOCO_TINTA =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

/* ==========================================================================
 * Piezas
 * ======================================================================== */

/** Caja de composición. Un único ancho de columna para todo el portal. */
export function Contenedor({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Rótulo con filete rojo delante. Sobre tinta el texto va en blanco atenuado
 * y no en rojo: el rojo institucional sobre azul profundo no alcanza el
 * contraste AA en cuerpos pequeños, así que ahí actúa sólo como marca gráfica.
 */
export function Rotulo({
  children,
  tono = "papel",
  className = "",
}: {
  children: ReactNode;
  tono?: "papel" | "tinta";
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-3 ${ROTULO} ${
        tono === "tinta" ? "text-white/75" : "text-brand-red"
      } ${className}`}
    >
      <span aria-hidden className="h-px w-7 shrink-0 bg-brand-red" />
      <span className="min-w-0">{children}</span>
    </p>
  );
}

/** Filete horizontal. El separador por defecto del portal. */
export function Filete({
  tono = "papel",
  className = "",
}: {
  tono?: "papel" | "tinta" | "rojo";
  className?: string;
}) {
  const color =
    tono === "tinta"
      ? "bg-white/15"
      : tono === "rojo"
        ? "bg-brand-red"
        : "bg-sig-rule";
  return (
    <span
      aria-hidden
      className={`block h-px w-full ${color} ${className}`}
    />
  );
}

/**
 * Campo de tinta: fondo azul profundo con una trama de finas líneas
 * verticales. La trama sustituye a las fotografías de archivo —que no
 * tenemos— y da textura de papel pautado sin cargar ningún recurso.
 */
export function CampoTinta({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative isolate overflow-hidden bg-brand-ink-deep text-white ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.55) 0 1px, transparent 1px 104px)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 90% at 88% 0%, rgba(27,44,120,0.85), transparent 62%), radial-gradient(ellipse 55% 70% at -5% 105%, rgba(212,24,31,0.28), transparent 60%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/**
 * Portada de ruta interior: rótulo, titular y entradilla sobre campo de tinta.
 * El titular es siempre el `h1` de la página, de modo que la jerarquía de
 * encabezados queda garantizada por construcción en las cinco rutas.
 */
export function PortadaRuta({
  rotulo,
  titulo,
  entradilla,
  pie,
}: {
  rotulo: ReactNode;
  titulo: ReactNode;
  entradilla?: ReactNode;
  /** Cifras o notas al pie de la portada. */
  pie?: ReactNode;
}) {
  return (
    <CampoTinta>
      <Contenedor className="pb-14 pt-14 sm:pb-20 sm:pt-20">
        <Rotulo tono="tinta">{rotulo}</Rotulo>
        <h1 className={`mt-7 max-w-[16ch] text-balance ${TITULAR_L}`}>
          {titulo}
        </h1>
        {entradilla && (
          <p className={`mt-6 max-w-[46ch] text-white/80 ${ENTRADILLA}`}>
            {entradilla}
          </p>
        )}
        {pie && <div className="mt-10">{pie}</div>}
      </Contenedor>
    </CampoTinta>
  );
}

/**
 * Encabezado de sección en dos columnas: el rótulo queda en el margen
 * izquierdo, como la nota al margen de un libro, y el titular ocupa la
 * columna de texto. Es lo que rompe el ritmo de «seis bloques centrados».
 */
export function EncabezadoSeccion({
  rotulo,
  titulo,
  entradilla,
  acciones,
  tono = "papel",
}: {
  rotulo: ReactNode;
  titulo: ReactNode;
  entradilla?: ReactNode;
  acciones?: ReactNode;
  tono?: "papel" | "tinta";
}) {
  const enTinta = tono === "tinta";
  return (
    <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
      <div className="lg:pt-2">
        <Rotulo tono={enTinta ? "tinta" : "papel"}>{rotulo}</Rotulo>
      </div>
      {/* Ojo con `ch`: la medida se calcula sobre la fuente del elemento que la
          lleva, así que los topes de línea van siempre en el propio titular o
          párrafo —nunca en el contenedor, donde valdrían el ancho de la letra
          de cuerpo y estrangularían la columna—. */}
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <div className="min-w-0 flex-1 basis-[26rem]">
          <h2
            className={`max-w-[22ch] text-balance ${TITULAR_M} ${
              enTinta ? "text-white" : "text-brand-ink"
            }`}
          >
            {titulo}
          </h2>
          {entradilla && (
            <p
              className={`mt-4 max-w-[52ch] ${CUERPO} ${
                enTinta ? "text-white/70" : "text-sig-text-soft"
              }`}
            >
              {entradilla}
            </p>
          )}
        </div>
        {acciones && <div className="shrink-0">{acciones}</div>}
      </div>
    </div>
  );
}

/**
 * Enlace de continuidad. Sustituye a los botones de llamada a la acción: en un
 * impreso institucional el lector sigue un enlace subrayado, no un botón.
 */
export function EnlaceEditorial({
  children,
  tono = "papel",
  className = "",
  ...rest
}: { tono?: "papel" | "tinta" } & ComponentProps<typeof Link>) {
  const enTinta = tono === "tinta";
  return (
    <Link
      {...rest}
      className={`group inline-flex items-center gap-2.5 border-b pb-1 ${ROTULO} transition-colors ${
        enTinta
          ? `border-white/30 text-white hover:border-white ${FOCO_TINTA}`
          : "border-brand-ink/25 text-brand-ink hover:border-brand-red hover:text-brand-red"
      } ${className}`}
    >
      <span>{children}</span>
      <span
        aria-hidden
        className="transition-transform duration-200 group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}

/**
 * Cifra destacada. Los datos duros del Vicerrectorado se componen como en una
 * memoria anual: número grande en monoespaciada y glosa en versalita.
 */
export function Cifra({
  valor,
  glosa,
  tono = "papel",
}: {
  valor: ReactNode;
  glosa: ReactNode;
  tono?: "papel" | "tinta";
}) {
  const enTinta = tono === "tinta";
  return (
    <div className="min-w-0">
      <p
        className={`${DATO} text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-none ${
          enTinta ? "text-white" : "text-brand-ink"
        }`}
      >
        {valor}
      </p>
      <p
        className={`mt-3 ${ROTULO} ${
          enTinta ? "text-white/60" : "text-sig-text-soft"
        }`}
      >
        {glosa}
      </p>
    </div>
  );
}

/**
 * Nota al pie. Para las advertencias que antes eran cajas de alerta amarillas:
 * el visitante no tiene por qué enterarse de que hay una integración caída,
 * pero tampoco se le puede dar un dato provisional como definitivo.
 */
export function NotaAlPie({ children }: { children: ReactNode }) {
  return (
    <p className="mt-12 max-w-[62ch] border-t border-sig-rule pt-5 font-serif text-[14px] italic leading-relaxed text-sig-text-soft">
      {children}
    </p>
  );
}
