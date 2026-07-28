import type { ComunicadoContent } from "@/lib/views/schemas";
import {
  CardBody,
  InfoList,
  PhotoPanel,
  SigBadge,
  SigCard,
} from "@/components/signage/primitives";

/**
 * Vista 5 — Comunicado importante.
 * Texto amplio a la izquierda y panel institucional de apoyo a la derecha.
 */
export function ComunicadoView({ content }: { content: ComunicadoContent }) {
  return (
    <>
      <SigCard span={8} center>
        <CardBody className="px-[42px] py-[36px]">
          <div className="mb-4">
            <SigBadge kind="onlight-soon">{content.badge}</SigBadge>
          </div>

          <h2 className="font-serif text-[38px] font-semibold leading-[1.22] text-sig-ink">
            {content.title}
          </h2>

          {content.subtitle && (
            <p className="mt-3 max-w-[640px] text-[17px] font-medium leading-[1.5] text-sig-ink-soft">
              {content.subtitle}
            </p>
          )}

          {content.highlight && (
            <p className="mt-4 font-serif text-[30px] font-bold text-sig-red">
              {content.highlight}
            </p>
          )}

          {content.body && (
            <p className="mt-4 max-w-[640px] text-[16px] leading-[1.65] text-sig-text-soft">
              {content.body}
            </p>
          )}

          {content.specs.length > 0 && (
            <div className="mt-6">
              <InfoList
                rows={content.specs.map((s) => ({
                  label: s.label,
                  value: s.value,
                }))}
              />
            </div>
          )}
        </CardBody>
      </SigCard>

      <PhotoPanel
        span={4}
        media={content.media}
        eyebrow={content.mediaEyebrow}
        title={content.mediaTitle || "Posgrado UABJB"}
        sub={content.mediaSub}
        flag={false}
      />
    </>
  );
}
