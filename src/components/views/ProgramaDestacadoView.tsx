import type { ProgramaDestacadoContent } from "@/lib/views/schemas";
import {
  CardBody,
  CardHead,
  FieldGrid,
  PhotoPanel,
  PullQuote,
  QrStrip,
  SigBadge,
  SigCard,
  type FieldEntry,
} from "@/components/signage/primitives";

/**
 * Vista 3 — Programa destacado.
 *
 * Retrato del programa a la izquierda y ficha completa a la derecha. Los
 * campos de la rejilla se arman con los datos explícitos del contenido; si
 * ninguno está lleno, se recurre a la lista `specs` del formato antiguo.
 */
export function ProgramaDestacadoView({
  content,
}: {
  content: ProgramaDestacadoContent;
}) {
  const explicit: FieldEntry[] = (
    [
      ["Inicio", content.startDate],
      ["Modalidad", content.modality],
      ["Duración", content.duration],
      ["Créditos", content.credits],
      ["Horas académicas", content.hours],
      ["Teléfonos", content.phones],
      ["Dirigido a", content.audience],
      ["Dirección", content.address],
    ] as const
  )
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => ({ label, value }));

  const fields =
    explicit.length > 0
      ? explicit
      : content.specs.map((s) => ({ label: s.label, value: s.value }));

  return (
    <>
      <PhotoPanel
        span={4}
        media={content.media}
        eyebrow={content.level || content.badge}
        title={content.programName}
        flag={false}
      >
        {(content.version || content.parallel) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {content.version && (
              <span className="inline-flex items-center rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[.6px] text-sig-ink">
                {content.version}
              </span>
            )}
            {content.parallel && (
              <span className="inline-flex items-center rounded-full border border-white/55 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[.6px] text-white">
                {content.parallel}
              </span>
            )}
          </div>
        )}
      </PhotoPanel>

      <SigCard span={8}>
        <CardHead
          eyebrow={content.badge}
          title="Datos del programa"
          right={
            <SigBadge
              kind={content.enrollmentOpen ? "onlight-open" : "onlight-soon"}
            >
              {content.enrollmentOpen ? "Inscripción abierta" : "Próximamente"}
            </SigBadge>
          }
        />
        <CardBody className="pt-3.5">
          {content.description && (
            <p className="max-w-[96%] text-[14.5px] leading-[1.6] text-sig-text-soft">
              {content.description}
            </p>
          )}

          <div className="mt-4.5">
            <FieldGrid fields={fields.slice(0, 8)} columns={4} />
          </div>

          {content.quote && (
            <div className="mt-5">
              <PullQuote size={16.5}>{content.quote}</PullQuote>
            </div>
          )}
        </CardBody>
        {content.qrCaption && <QrStrip label={content.qrCaption} />}
      </SigCard>
    </>
  );
}
