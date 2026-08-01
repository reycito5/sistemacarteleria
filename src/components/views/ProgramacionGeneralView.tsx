"use client";

import type { ProgramacionGeneralContent } from "@/lib/views/schemas";
import {
  CardBody,
  CardHead,
  FieldGrid,
  PhotoPanel,
  QrStrip,
  SigBadge,
  SigCard,
} from "@/components/signage/primitives";
import { AutoFitText } from "@/components/signage/AutoFitText";
import { useSequentialRotator } from "@/components/signage/Rotator";

/** Oferta como cola editorial: cada programa recibe una pantalla completa. */
export function ProgramacionGeneralView({
  content,
  onComplete,
}: {
  content: ProgramacionGeneralContent;
  onComplete?: () => void;
}) {
  const programs =
    content.programs.length > 0
      ? content.programs
      : content.offers.map((offer) => ({
          name: offer.title,
          type: "Programa de posgrado",
          version: "",
          modality: offer.modality,
          duration: "",
          credits: "",
          dateShort: offer.start,
          status: "open" as const,
          displaySeconds: 10,
          media: undefined,
        }));

  const queue =
    programs.length > 0
      ? programs
      : [
          {
            name: content.headline || content.sectionTitle,
            type: "Oferta académica",
            version: "",
            modality: "",
            duration: "",
            credits: "",
            dateShort: "",
            status: "open" as const,
            displaySeconds: 10,
            media: content.media,
          },
        ];

  const { index } = useSequentialRotator(
    queue.length,
    (current) => queue[current]?.displaySeconds ?? 10,
    true,
    { loop: false, onComplete },
  );
  const program = queue[Math.min(index, queue.length - 1)];
  const details = [
    ["Modalidad", program.modality],
    ["Duración", program.duration],
    ["Créditos", program.credits],
    ["Inicio", program.dateShort],
  ]
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => ({ label, value }));

  return (
    <div
      key={`${program.name}-${index}`}
      className="col-span-12 grid min-h-0 grid-cols-12 gap-[28px] ui-fade-in"
    >
      <PhotoPanel
        span={5}
        media={program.media ?? (index === 0 ? content.media : undefined)}
        eyebrow={[program.type, program.version].filter(Boolean).join(" · ")}
        title={program.name}
        sub={content.subheadline || content.strapline}
        posterFrame
      />

      <SigCard span={7}>
        <CardHead
          eyebrow={content.cardEyebrow}
          title={content.sectionTitle}
          right={
            <SigBadge kind={program.status === "soon" ? "onlight-soon" : "onlight-open"}>
              {program.status === "soon" ? "Próximamente" : "Inscripción abierta"}
            </SigBadge>
          }
        />

        <div className="flex items-center gap-4 border-b border-sig-rule px-[38px] py-4">
          <span className="font-mono text-[16px] font-bold tracking-[.12em] text-sig-red">
            PROGRAMA {String(index + 1).padStart(2, "0")} / {String(queue.length).padStart(2, "0")}
          </span>
          <div className="flex flex-1 gap-2">
            {queue.map((_, position) => (
              <span
                key={position}
                className={`h-1.5 flex-1 rounded-full ${position === index ? "bg-sig-red" : "bg-sig-rule"}`}
              />
            ))}
          </div>
        </div>

        <CardBody className="justify-center py-[30px]">
          <p className="font-mono text-[18px] font-bold uppercase tracking-[.14em] text-sig-red">
            {[program.type, program.version].filter(Boolean).join(" · ") || "Programa de posgrado"}
          </p>
          <AutoFitText
            as="h2"
            className="mt-5 font-serif font-bold leading-[1.08] text-sig-ink"
            maxSize={52}
            minSize={25}
            maxHeight={225}
          >
            {program.name}
          </AutoFitText>
          {details.length > 0 && (
            <div className="mt-8">
              <FieldGrid fields={details} columns={2} />
            </div>
          )}
        </CardBody>
        {content.qrCaption && (
          <QrStrip label={content.qrCaption} url={content.qrUrl} />
        )}
      </SigCard>
    </div>
  );
}
