import type { ProgramaDestacadoContent } from "@/lib/views/schemas";
import {
  DataPoint,
  Kicker,
  RedBar,
  SplitLayout,
} from "@/components/signage/layouts";
import { QrCode } from "@/components/signage/QrCode";
import { T, LH, autoSize } from "@/components/signage/scale";

/**
 * Vista 3 — Programa destacado.
 *
 * Arquetipo SPLIT MACIZO: el retrato del programa a sangre a la izquierda con
 * el nombre encima, y la ficha sobre un bloque azul lleno a la derecha. El
 * bloque de color pesa más que una tarjeta con borde y separa con claridad
 * «de qué programa hablamos» de «cuáles son sus datos».
 *
 * Los campos se arman con los datos explícitos del contenido; si ninguno está
 * lleno, se recurre a la lista `specs` del formato antiguo.
 */
export function ProgramaDestacadoView({
  content,
}: {
  content: ProgramaDestacadoContent;
}) {
  const explicit = (
    [
      ["Inicio", content.startDate],
      ["Modalidad", content.modality],
      ["Duración", content.duration],
      ["Créditos", content.credits],
      ["Horas académicas", content.hours],
      ["Dirigido a", content.audience],
      ["Teléfonos", content.phones],
      ["Dirección", content.address],
    ] as const
  )
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => ({ label, value }));

  const fields = (
    explicit.length > 0
      ? explicit
      : content.specs.map((s) => ({ label: s.label, value: s.value }))
  ).slice(0, 8);

  // Ocho campos no pueden ocupar lo mismo que cuatro: la zona central sólo da
  // ~666 px de alto y por debajo va el rótulo institucional.
  const dense = fields.length > 6;
  const fieldSize = dense ? 30 : T.itemTitle;

  return (
    <SplitLayout
      media={content.media}
      mediaSide="left"
      mediaSpan={5}
      solid
      stretch
      mediaOverlay={
        <>
          <div className="mb-6">
            <RedBar>{content.badge}</RedBar>
          </div>
          {content.level && <Kicker onDark>{content.level}</Kicker>}
          <h2
            className="mt-4 font-serif font-black text-white"
            style={{
              fontSize: autoSize(content.programName, T.hero, 46, 24),
              lineHeight: LH.hero,
              textShadow: "0 4px 40px rgba(0,0,0,.55)",
            }}
          >
            {content.programName}
          </h2>
          {(content.version || content.parallel) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {content.version && (
                <span
                  className="bg-white px-6 py-2.5 font-bold uppercase tracking-[.08em] text-sig-ink"
                  style={{ fontSize: T.eyebrow }}
                >
                  {content.version}
                </span>
              )}
              {content.parallel && (
                <span
                  className="border-2 border-white/70 px-6 py-2.5 font-bold uppercase tracking-[.08em] text-white"
                  style={{ fontSize: T.eyebrow }}
                >
                  {content.parallel}
                </span>
              )}
            </div>
          )}
        </>
      }
    >
      <div className="flex flex-1 flex-col px-[48px] py-[24px]">
        <div className="flex shrink-0 items-center justify-between gap-6">
          <Kicker onDark>Ficha del programa</Kicker>
          <span
            className={`whitespace-nowrap px-5 py-2.5 font-bold uppercase tracking-[.08em] ${
              content.enrollmentOpen
                ? "bg-[#8FE3B4] text-[#0B3D24]"
                : "bg-[#F0C275] text-[#3B2A0E]"
            }`}
            style={{ fontSize: T.eyebrow }}
          >
            {content.enrollmentOpen ? "Inscripción abierta" : "Próximamente"}
          </span>
        </div>

        {content.description && (
          <p
            className="mt-4 line-clamp-2 shrink-0 font-medium text-white/80"
            style={{ fontSize: T.body, lineHeight: LH.body }}
          >
            {content.description}
          </p>
        )}

        <div
          className="mt-6 grid shrink-0 grid-cols-2 gap-x-10"
          style={{ rowGap: dense ? 14 : 24 }}
        >
          {fields.map((f, i) => (
            <DataPoint
              key={`${f.label}-${i}`}
              label={f.label}
              value={f.value}
              size={fieldSize}
              onDark
            />
          ))}
        </div>

        {content.quote && !dense && (
          <blockquote
            className="mt-6 line-clamp-2 shrink-0 border-l-[6px] border-sig-red pl-7 font-serif italic text-white/85"
            style={{ fontSize: T.bodyLg, lineHeight: 1.3 }}
          >
            {content.quote}
          </blockquote>
        )}

        {(content.qrUrl || content.qrCaption) && (
          <div className="mt-auto flex shrink-0 items-center gap-6 border-t border-white/20 pt-5">
            {content.qrUrl && (
              <div className="shrink-0 bg-white p-2.5">
                <QrCode value={content.qrUrl} size={92} />
              </div>
            )}
            <div className="min-w-0">
              <Kicker onDark>Escanea el código</Kicker>
              <p
                className="mt-1.5 line-clamp-2 font-serif font-bold leading-tight text-white"
                style={{ fontSize: T.itemTitle }}
              >
                {content.qrCaption}
              </p>
            </div>
          </div>
        )}
      </div>
    </SplitLayout>
  );
}
