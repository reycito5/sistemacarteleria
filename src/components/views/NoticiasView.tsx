"use client";

import { useEffect } from "react";
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
import { AutoFitText } from "@/components/signage/AutoFitText";
import { useSequentialRotator } from "@/components/signage/Rotator";
import { isVideoRef } from "@/components/signage/mediaKind";

/**
 * Cola editorial finita. Empieza siempre por la primera noticia agregada,
 * mantiene medio y texto sincronizados y avisa a la playlist únicamente
 * después de terminar la última entrada.
 */
export function NoticiasView({
  content,
  onComplete,
}: {
  content: NoticiasContent;
  onComplete?: () => void;
}) {
  const entries =
    content.entries.length > 0
      ? content.entries
      : content.items.map((item) => ({
          title: item.headline,
          meta: [item.tag, item.date].filter(Boolean).join(" · "),
          kind: "noticia" as const,
          duration: "",
          displaySeconds: 12,
          maxVideoSeconds: 900,
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
            displaySeconds: 12,
            maxVideoSeconds: 900,
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
    (current) => normalized[current]?.displaySeconds ?? 12,
    (current) => {
      const active = normalized[current];
      const activeMedia = active?.media ?? (current === 0 ? content.media : undefined);
      return active?.kind !== "video" || !isVideoRef(activeMedia);
    },
    { loop: false, onComplete },
  );

  const entry = normalized[Math.min(index, normalized.length - 1)];
  const entryMedia = entry.media ?? (index === 0 ? content.media : undefined);
  const playsVideo = entry.kind === "video" && isVideoRef(entryMedia);
  const queueLabel = `${String(index + 1).padStart(2, "0")} / ${String(normalized.length).padStart(2, "0")}`;

  useEffect(() => {
    if (!playsVideo) return;
    // Última red de seguridad: un MP4 incompleto, un CDN interrumpido o un
    // navegador que nunca emita `ended` no puede secuestrar la programación.
    const timer = window.setTimeout(
      advance,
      Math.max(15, entry.maxVideoSeconds ?? 900) * 1000,
    );
    return () => window.clearTimeout(timer);
  }, [advance, entry.maxVideoSeconds, index, playsVideo]);

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

        <div className="flex items-center gap-4 border-b border-sig-rule px-[38px] py-4">
          <span className="font-mono text-[16px] font-bold tracking-[.12em] text-sig-red">
            COLA {queueLabel}
          </span>
          <div className="flex flex-1 gap-2">
            {normalized.map((_, position) => (
              <span
                key={position}
                className={`h-1.5 flex-1 rounded-full ${
                  position < index
                    ? "bg-sig-ink/25"
                    : position === index
                      ? "bg-sig-red ui-progress-pulse"
                      : "bg-sig-rule"
                }`}
              />
            ))}
          </div>
        </div>

        <CardBody className="justify-center py-[28px]">
          <Eyebrow>{entry.kind === "video" ? "Reproduciendo ahora" : "En pantalla ahora"}</Eyebrow>
          <AutoFitText
            as="h2"
            className="mt-5 font-serif font-bold leading-[1.1] text-sig-ink"
            maxSize={50}
            minSize={24}
            maxHeight={250}
          >
            {entry.title}
          </AutoFitText>
          {entry.meta && (
            <AutoFitText
              className="mt-7 leading-[1.4] text-sig-text-soft"
              maxSize={25}
              minSize={17}
              maxHeight={180}
            >
              {entry.meta}
            </AutoFitText>
          )}
        </CardBody>
        {stats.length > 0 && <StatRow stats={stats.slice(0, 2)} />}
      </SigCard>
    </div>
  );
}
