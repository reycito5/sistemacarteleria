import type { AgendaContent } from "@/lib/views/schemas";
import {
  AgendaRow,
  CardBody,
  CardHead,
  NextStrip,
  PhotoPanel,
  SigBadge,
  SigCard,
} from "@/components/signage/primitives";

const STATUS_BADGE = {
  en_curso: { kind: "onlight-live" as const, label: "En curso" },
  proxima: { kind: "onlight" as const, label: "Próxima" },
  finalizada: { kind: "neutral" as const, label: "Finalizada" },
};

/**
 * Vistas 2 y 8 — Agenda académica y actividades del día.
 * Cada actividad muestra su hora, lugar y el estado en que se encuentra.
 */
export function AgendaView({ content }: { content: AgendaContent }) {
  return (
    <>
      <PhotoPanel
        span={7}
        media={content.media}
        eyebrow={content.headlineEyebrow}
        title={content.headline || content.sectionTitle}
        sub={content.subheadline || content.strapline}
        flag={false}
      />

      <SigCard span={5}>
        <CardHead eyebrow={content.badge} title={content.sectionTitle} />
        <CardBody>
          <div className="flex flex-1 flex-col overflow-hidden">
            {content.items.map((item, i) => {
              const badge = STATUS_BADGE[item.status];
              return (
                <AgendaRow
                  key={`${item.title}-${i}`}
                  time={item.time}
                  title={item.title}
                  meta={[item.place, item.date].filter(Boolean).join(" · ")}
                  badge={<SigBadge kind={badge.kind}>{badge.label}</SigBadge>}
                />
              );
            })}
          </div>
        </CardBody>
        {content.nextLabel && <NextStrip label={content.nextLabel} />}
      </SigCard>
    </>
  );
}
