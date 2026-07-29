import type { ProximosIniciosContent } from "@/lib/views/schemas";
import {
  CardBody,
  CardHead,
  Eyebrow,
  ProgramMini,
  SigCard,
} from "@/components/signage/primitives";
import { QrCode } from "@/components/signage/QrCode";
import { T } from "@/components/signage/scale";

/**
 * Vista 6 — Próximos inicios de gestión.
 *
 * Rejilla de programas con la fecha de inicio en grande sobre cada portada, y
 * una columna estrecha con el código QR de inscripción.
 */
export function ProximosIniciosView({
  content,
}: {
  content: ProximosIniciosContent;
}) {
  return (
    <>
      <SigCard span={10}>
        <CardHead eyebrow={content.eyebrow} title={content.sectionTitle} />
        <CardBody className="flex-row gap-0 px-0 pb-0 pt-3.5">
          {content.programs.slice(0, 4).map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className={`flex flex-1 ${i > 0 ? "border-l border-sig-rule" : ""}`}
            >
              <ProgramMini program={p} />
            </div>
          ))}
        </CardBody>
      </SigCard>

      <SigCard span={2} center>
        <CardBody className="items-center justify-center text-center">
          <Eyebrow className="mb-3.5">{content.qrCaption}</Eyebrow>
          {content.qrUrl && (
            <div className="rounded-[4px] border-2 border-sig-rule bg-white p-2">
              <QrCode value={content.qrUrl} size={168} />
            </div>
          )}
          <p
            className="mt-5 font-serif font-bold leading-tight text-sig-ink"
            style={{ fontSize: T.itemTitle }}
          >
            {content.qrTitle}
          </p>
          {content.qrNote && (
            <p
              className="mt-2 text-sig-text-soft"
              style={{ fontSize: T.meta }}
            >
              {content.qrNote}
            </p>
          )}
        </CardBody>
      </SigCard>
    </>
  );
}
