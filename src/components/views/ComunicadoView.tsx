import type { ComunicadoContent } from "@/lib/views/schemas";
import {
  CardBody,
  InfoList,
  PhotoPanel,
  SigBadge,
  SigCard,
} from "@/components/signage/primitives";
import { T } from "@/components/signage/scale";

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

          <h2
            className="line-clamp-3 font-serif font-bold leading-[1.06] text-sig-ink"
            style={{ fontSize: 68 }}
          >
            {content.title}
          </h2>

          {content.subtitle && (
            <p
              className="mt-4 line-clamp-2 max-w-[920px] font-medium leading-[1.3] text-sig-ink-soft"
              style={{ fontSize: T.bodyLg }}
            >
              {content.subtitle}
            </p>
          )}

          {content.highlight && (
            <p
              className="mt-5 line-clamp-1 font-serif font-bold leading-none text-sig-red"
              style={{ fontSize: 60 }}
            >
              {content.highlight}
            </p>
          )}

          {content.body && (
            <p
              className="mt-5 line-clamp-3 max-w-[920px] leading-[1.4] text-sig-text-soft"
              style={{ fontSize: T.body }}
            >
              {content.body}
            </p>
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
