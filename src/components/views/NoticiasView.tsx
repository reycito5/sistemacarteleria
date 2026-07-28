import type { NoticiasContent } from "@/lib/views/schemas";
import { BigStat, PosterLayout, RedBar } from "@/components/signage/layouts";
import { Rotator } from "@/components/signage/Rotator";
import { T } from "@/components/signage/scale";

/**
 * Vistas 4 y 9 — Noticias y logros.
 *
 * Arquetipo PÓSTER ROTATIVO: cada noticia ocupa la pantalla ENTERA durante
 * unos segundos con su propia foto o video. Apilar cuatro titulares pequeños
 * en una tarjeta lateral era ilegible desde el pasillo; así cada titular se
 * lee entero y la rotación va sincronizada por reloj en los cuatro
 * televisores, de modo que todos muestran la misma noticia a la vez.
 *
 * Se usa `entries` cuando está lleno y, si no, la lista `items` del formato
 * antiguo, para que el contenido ya guardado siga viéndose.
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

  const aside =
    stats.length > 0 ? (
      <>
        {stats.slice(0, 2).map((s, i) => (
          <BigStat key={i} value={s.value} label={s.label} onDark />
        ))}
      </>
    ) : undefined;

  // Sin entradas, la pantalla sigue siendo válida: muestra el titular general.
  if (entries.length === 0) {
    return (
      <PosterLayout
        media={content.media}
        kicker={content.headlineEyebrow}
        title={content.headline || content.title}
        sub={content.subheadline || content.strapline}
        badge={<RedBar>{content.badge}</RedBar>}
        aside={aside}
      />
    );
  }

  return (
    <div className="col-span-12 flex min-h-0 flex-1 flex-col">
      <Rotator
        seconds={9}
        items={entries.slice(0, 4).map((n, i) => (
          <PosterLayout
            key={`${n.title}-${i}`}
            media={n.media ?? content.media}
            kicker={n.meta || content.headlineEyebrow}
            title={n.title}
            sub={i === 0 ? content.subheadline || content.strapline : undefined}
            badge={
              <RedBar>
                {n.kind === "video"
                  ? `Video${n.duration ? ` · ${n.duration}` : ""}`
                  : content.badge}
              </RedBar>
            }
            aside={aside}
          >
            <p
              className="mt-8 font-mono font-bold uppercase tracking-[.2em] text-white/55"
              style={{ fontSize: T.eyebrow }}
            >
              {content.title} · {i + 1} de {Math.min(entries.length, 4)}
            </p>
          </PosterLayout>
        ))}
      />
    </div>
  );
}
