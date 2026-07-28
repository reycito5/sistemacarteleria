import type { AgendaContent } from "@/lib/views/schemas";
import { IndexLayout, IndexRow, SigBadge } from "@/components/signage/layouts";
import { SignageMedia } from "@/components/signage/SignageMedia";
import { T, LH, rowScale } from "@/components/signage/scale";

const STATUS_BADGE = {
  en_curso: { kind: "onlight-live" as const, label: "En curso" },
  proxima: { kind: "onlight" as const, label: "Próxima" },
  finalizada: { kind: "neutral" as const, label: "Finalizada" },
};

/**
 * Vistas 2 y 8 — Agenda académica y actividades del día.
 *
 * Arquetipo ÍNDICE a todo el ancho: una agenda es una tabla y compite mal
 * dentro de una tarjeta estrecha. La hora hace de ancla a la izquierda y la
 * actividad en curso se resalta con fondo, de modo que quien pasa reconoce
 * «qué está ocurriendo ahora» sin leer la lista entera.
 */
export function AgendaView({ content }: { content: AgendaContent }) {
  const hasMedia = Boolean(content.media?.src);
  const items = content.items.slice(0, 5);
  const row = rowScale(items.length);
  // El texto de apoyo sólo cabe cuando la agenda es corta.
  const intro =
    items.length <= 3 ? content.subheadline || content.strapline : "";

  return (
    <IndexLayout
      kicker={content.headlineEyebrow || content.badge}
      title={content.headline || content.sectionTitle}
      right={
        hasMedia ? (
          <div className="relative h-[196px] w-[400px] overflow-hidden rounded-[4px] bg-sig-ink-deep">
            <SignageMedia media={content.media} fallbackLabel="" />
          </div>
        ) : undefined
      }
      footer={
        content.nextLabel ? (
          <div className="mt-auto flex items-center gap-8 bg-sig-ink px-[56px] py-5">
            <p
              className="shrink-0 font-mono font-bold uppercase tracking-[.2em] text-[#FF9DA0]"
              style={{ fontSize: T.eyebrow }}
            >
              A continuación
            </p>
            <p
              className="min-w-0 flex-1 truncate font-serif font-bold text-white"
              style={{ fontSize: T.itemTitle }}
            >
              {content.nextLabel}
            </p>
          </div>
        ) : undefined
      }
    >
      {intro && (
        <p
          className="line-clamp-2 border-b border-sig-rule pb-5 pt-1 font-medium text-sig-text-soft"
          style={{ fontSize: T.bodyLg, lineHeight: LH.body }}
        >
          {intro}
        </p>
      )}

      <div className="flex flex-1 flex-col justify-center">
        {items.map((item, i) => {
          const badge = STATUS_BADGE[item.status];
          return (
            <IndexRow
              key={`${item.title}-${i}`}
              index={i + 1}
              lead={item.time || undefined}
              title={item.title}
              meta={[item.place, item.date].filter(Boolean).join(" · ")}
              accent={item.status === "en_curso"}
              size={row.title}
              padY={row.padY}
              right={<SigBadge kind={badge.kind}>{badge.label}</SigBadge>}
            />
          );
        })}
      </div>
    </IndexLayout>
  );
}
