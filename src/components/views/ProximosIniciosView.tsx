import type { ProximosIniciosContent } from "@/lib/views/schemas";
import {
  CardBody,
  CardHead,
  Eyebrow,
  ProgramMini,
  SigCard,
} from "@/components/signage/primitives";

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
          <div className="h-[120px] w-[120px] bg-white p-1.5">
            <div className="grid h-full w-full place-items-center border-2 border-sig-ink font-mono text-[10px] font-bold text-sig-ink">
              QR
            </div>
          </div>
          <p className="mt-4 font-serif text-[15px] font-semibold text-sig-ink">
            {content.qrTitle}
          </p>
          {content.qrNote && (
            <p className="mt-1.5 text-[11.5px] text-sig-text-soft">
              {content.qrNote}
            </p>
          )}
        </CardBody>
      </SigCard>
    </>
  );
}
