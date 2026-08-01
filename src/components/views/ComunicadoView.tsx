import type { ComunicadoContent } from "@/lib/views/schemas";
import {
  CardBody,
  InfoList,
  PhotoPanel,
  SigBadge,
  SigCard,
} from "@/components/signage/primitives";
import { T } from "@/components/signage/scale";
import { AutoFitText } from "@/components/signage/AutoFitText";

/**
 * Vista 5 — Comunicado importante.
 * Texto amplio a la izquierda y panel institucional de apoyo a la derecha.
 */
export function ComunicadoView({ content }: { content: ComunicadoContent }) {
  return (
    <>
      <SigCard span={8}>
        <CardBody className="justify-center px-[46px] py-[38px]">
          <div className="mb-4">
            <SigBadge kind="onlight-soon">{content.badge}</SigBadge>
          </div>

          <AutoFitText
            as="h2"
            className="font-serif font-bold leading-[1.06] text-sig-ink"
            maxSize={60}
            minSize={30}
            maxHeight={190}
          >
            {content.title}
          </AutoFitText>

          {content.subtitle && (
            <AutoFitText
              className="mt-4 max-w-[920px] font-medium leading-[1.3] text-sig-ink-soft"
              maxSize={T.bodyLg}
              minSize={18}
              maxHeight={82}
            >
              {content.subtitle}
            </AutoFitText>
          )}

          {content.highlight && (
            <AutoFitText
              className="mt-5 font-serif font-bold leading-none text-sig-red"
              maxSize={52}
              minSize={25}
              maxHeight={62}
            >
              {content.highlight}
            </AutoFitText>
          )}

          {content.body && (
            <AutoFitText
              className="mt-5 max-w-[920px] leading-[1.4] text-sig-text-soft"
              maxSize={T.body}
              minSize={16}
              maxHeight={118}
            >
              {content.body}
            </AutoFitText>
          )}

          {content.specs.length > 0 && (
            <div className="mt-5">
              <InfoList
                rows={content.specs.slice(0, 4).map((s) => ({
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
