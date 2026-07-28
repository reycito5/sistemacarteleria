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
      <SigCard span={8} center>
        <CardBody className="px-[42px] py-[36px]">
          <div className="mb-4">
            <SigBadge kind="onlight-soon">{content.badge}</SigBadge>
          </div>

          <h2
            className="font-serif font-bold leading-[1.08] text-sig-ink"
            style={{ fontSize: T.hero }}
          >
            {content.title}
          </h2>

          {content.subtitle && (
            <p
              className="mt-5 max-w-[900px] font-medium leading-[1.35] text-sig-ink-soft"
              style={{ fontSize: T.bodyLg }}
            >
              {content.subtitle}
            </p>
          )}

          {content.highlight && (
            <p
              className="mt-6 font-serif font-bold leading-none text-sig-red"
              style={{ fontSize: T.stat }}
            >
              {content.highlight}
            </p>
          )}

          {content.body && (
            <p
              className="mt-6 max-w-[900px] leading-[1.45] text-sig-text-soft"
              style={{ fontSize: T.body }}
            >
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
