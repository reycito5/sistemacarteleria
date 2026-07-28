import type { NoticiasContent } from "@/lib/views/schemas";
import {
  CardBody,
  CardHead,
  NewsRow,
  PhotoPanel,
  SigCard,
  StatRow,
} from "@/components/signage/primitives";
import { Rotator } from "@/components/signage/Rotator";

/**
 * Vistas 4 y 9 — Noticias y logros.
 *
 * Cada entrada puede ser un artículo o un video con su propia portada. Se usa
 * `entries` cuando está lleno y, si no, la lista `items` del formato antiguo.
 */
export function NoticiasView({ content }: { content: NoticiasContent }) {
  const entries =
    content.entries.length > 0
      ? content.entries
      : content.items.map((i) => ({
          title: i.headline,
          meta: [i.tag, i.date].filter(Boolean).join(" · "),
          kind: "noticia" as const,
          duration: "",
          media: undefined,
        }));

  const stats =
    content.stats.length > 0
      ? content.stats
      : content.bigStat
        ? [{ value: content.bigStat, label: content.bigStatLabel }]
        : [];

  return (
    <>
      <PhotoPanel
        span={7}
        media={content.media}
        eyebrow={content.headlineEyebrow}
        title={content.headline || content.title}
        sub={content.subheadline || content.strapline}
      />

      <SigCard span={5}>
        <CardHead eyebrow={content.badge} title={content.title} />
        <CardBody className="pb-4">
          {/* Una noticia a la vez: en un televisor, cuatro apiladas no se leen.
              El paso se sincroniza por reloj en las cuatro pantallas. */}
          <Rotator
            seconds={8}
            items={entries.slice(0, 4).map((n, i) => (
              <NewsRow
                key={`${n.title}-${i}`}
                title={n.title}
                meta={n.meta}
                media={n.media}
                isVideo={n.kind === "video"}
                duration={n.duration}
              />
            ))}
          />
        </CardBody>
        <StatRow stats={stats.slice(0, 2)} />
      </SigCard>
    </>
  );
}
