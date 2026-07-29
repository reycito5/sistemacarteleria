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
import { T } from "@/components/signage/scale";

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
      {/* Medio limpio: se ve el afiche o el video sin texto encima. */}
      <PhotoPanel span={4} media={content.media} flag={false} />

      <SigCard span={8}>
        <CardHead
          eyebrow={content.level || content.badge}
          title={content.programName}
          right={
            <SigBadge
              kind={content.enrollmentOpen ? "onlight-open" : "onlight-soon"}
            >
              {content.enrollmentOpen ? "Inscripción abierta" : "Próximamente"}
            </SigBadge>
          }
        />
        <CardBody className="pt-3.5">
          {(content.version || content.parallel) && (
            <div className="mb-4 flex flex-wrap gap-2.5">
              {content.version && (
                <span className="inline-flex items-center rounded-full bg-sig-ink px-5 py-2 text-[20px] font-bold uppercase tracking-[.08em] text-white">
                  {content.version}
                </span>
              )}
              {content.parallel && (
                <span className="inline-flex items-center rounded-full border-2 border-sig-rule px-5 py-2 text-[20px] font-bold uppercase tracking-[.08em] text-sig-ink">
                  {content.parallel}
                </span>
              )}
            </div>
          )}

          {content.description && (
            <p
              className="line-clamp-4 max-w-[96%] leading-[1.45] text-sig-text-soft"
              style={{ fontSize: T.body }}
            >
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
        {content.qrCaption && (
          <QrStrip label={content.qrCaption} url={content.qrUrl} />
        )}
      </SigCard>
    </>
  );
}
