"use client";

import type { NoticiasContent } from "@/lib/views/schemas";
import {
  CardBody,
  CardHead,
  Eyebrow,
  PhotoPanel,
  SigBadge,
  SigCard,
  StatRow,
} from "@/components/signage/primitives";
import { useSequentialRotator } from "@/components/signage/Rotator";
import { T } from "@/components/signage/scale";
import { isVideoRef } from "@/components/signage/mediaKind";

/**
 * Noticias como diapositivas completas. El medio y su texto cambian juntos;
 * nunca quedan dos videos montados ni una miniatura ajena al titular activo.
 */
export function NoticiasView({ content }: { content: NoticiasContent }) {
  const entries =
    content.entries.length > 0
      ? content.entries
      : content.items.map((item) => ({
          title: item.headline,
          meta: [item.tag, item.date].filter(Boolean).join(" · "),
          kind: "noticia" as const,
          duration: "",
          media: undefined,
        }));

  const normalized =
    entries.length > 0
      ? entries
      : [
          {
            title: content.headline || content.title,
            meta: content.subheadline || content.strapline,
            kind: "noticia" as const,
            duration: "",
            media: content.media,
          },
        ];
  const stats =
    content.stats.length > 0
      ? content.stats
      : content.bigStat
        ? [{ value: content.bigStat, label: content.bigStatLabel }]
        : [];
  const { index, advance } = useSequentialRotator(
    normalized.length,
    10,
    (current) => {
      const currentEntry = normalized[current];
      const currentMedia = currentEntry?.media ?? (current === 0 ? content.media : undefined);
      return currentEntry?.kind !== "video" || !isVideoRef(currentMedia);
    },
  );
  const entry = normalized[Math.min(index, normalized.length - 1)];
  const entryMedia = entry.media ?? (index === 0 ? content.media : undefined);
  const playsVideo = entry.kind === "video" && isVideoRef(entryMedia);

  return (
    <div
      key={`${entry.title}-${index}`}
      className="col-span-12 grid min-h-0 grid-cols-12 gap-[28px] ui-fade-in"
    >
          <PhotoPanel
            span={7}
            media={entryMedia}
            eyebrow={entry.kind === "video" ? "Video institucional" : content.headlineEyebrow}
            title={entry.title}
            sub={entry.meta}
            mediaLoop={!playsVideo}
            onMediaEnded={playsVideo ? advance : undefined}
            onMediaError={playsVideo ? advance : undefined}
          />

          <SigCard span={5}>
            <CardHead
              eyebrow="Noticias del Posgrado"
              title={entry.kind === "video" ? "Video institucional" : "Actualidad institucional"}
              right={
                <SigBadge kind={entry.kind === "video" ? "onlight-live" : "onlight"}>
                  {entry.kind === "video" ? "Video" : "Noticia"}
                </SigBadge>
              }
            />
            <CardBody className="justify-center">
              <Eyebrow>{entry.kind === "video" ? "Ahora en pantalla" : "Actualidad"}</Eyebrow>
              <h2
                className="mt-4 break-words font-serif font-bold leading-[1.12] text-sig-ink"
                style={{ fontSize: entry.title.length > 150 ? 28 : entry.title.length > 105 ? 34 : entry.title.length > 65 ? 40 : 48 }}
              >
                {entry.title}
              </h2>
              {entry.meta && (
                <p
                  className="mt-6 break-words leading-[1.38] text-sig-text-soft"
                  style={{ fontSize: entry.meta.length > 220 ? 18 : entry.meta.length > 130 ? 21 : T.body }}
                >
                  {entry.meta}
                </p>
              )}
              {entry.duration && (
                <p className="mt-6 font-mono text-[18px] font-bold text-sig-red">
                  DURACIÓN · {entry.duration}
                </p>
              )}
            </CardBody>
            {stats.length > 0 && <StatRow stats={stats.slice(0, 2)} />}
          </SigCard>
    </div>
  );
}
