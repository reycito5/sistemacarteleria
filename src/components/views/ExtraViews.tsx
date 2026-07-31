import type {
  BienvenidaContent,
  ReconocimientosContent,
  EventoVivoContent,
  TestimonioContent,
  MensajeContent,
} from "@/lib/views/schemas";
import {
  AgendaRow,
  CardBody,
  CardHead,
  FieldGrid,
  InfoList,
  LogroList,
  NextStrip,
  PhotoPanel,
  PullQuote,
  QrStrip,
  SigBadge,
  SigCard,
  StatRow,
} from "@/components/signage/primitives";
import { T } from "@/components/signage/scale";
import { VerticalPager } from "@/components/signage/VerticalPager";

/** Vista 7 — Bienvenida y orientación al visitante. */
export function BienvenidaView({ content }: { content: BienvenidaContent }) {
  return (
    <>
      <PhotoPanel
        span={7}
        media={content.media}
        eyebrow="Bienvenida"
        title={content.title}
        sub={content.subtitle || content.strapline}
      />
      <SigCard span={5}>
        <CardHead eyebrow="Ubicaciones" title="Orientación al visitante" />
        <CardBody>
          <VerticalPager
            pageSize={5}
            items={content.locations.map((location, index) => (
              <InfoList
                key={`${location.label}-${index}`}
                rows={[{ label: location.label, value: location.place }]}
              />
            ))}
          />
        </CardBody>
        {content.qrCaption && (
          <QrStrip label={content.qrCaption} url={content.qrUrl} />
        )}
      </SigCard>
    </>
  );
}

/** Vista 9 — Reconocimientos académicos. */
export function ReconocimientosView({
  content,
}: {
  content: ReconocimientosContent;
}) {
  const [featured, ...rest] = content.items;

  return (
    <>
      <PhotoPanel
        span={5}
        media={content.media}
        eyebrow="Reconocimiento académico"
        title={featured?.name ?? content.title}
        sub={featured?.role ?? content.strapline}
        badge={<SigBadge kind="info">{content.badge}</SigBadge>}
      />
      <SigCard span={7}>
        <CardHead eyebrow="Categoría" title={content.title} />
        <CardBody className="pt-3.5">
          {featured?.detail && (
            <FieldGrid
              columns={2}
              fields={[
                { label: "Distinción", value: featured.role || "—" },
                { label: "Detalle", value: featured.detail },
              ]}
            />
          )}
          {rest.length > 0 && (
            <div className="mt-5">
              <VerticalPager
                pageSize={4}
                items={rest.map((recognition, index) => (
                  <LogroList
                    key={`${recognition.name}-${index}`}
                    items={[
                      [recognition.name, recognition.role, recognition.detail]
                        .filter(Boolean)
                        .join(" — "),
                    ]}
                  />
                ))}
              />
            </div>
          )}
          {content.strapline && (
            <div className="mt-5">
              <PullQuote size={18}>{content.strapline}</PullQuote>
            </div>
          )}
        </CardBody>
      </SigCard>
    </>
  );
}

/** Vista 10 — Transmisión o evento en vivo. */
export function EventoVivoView({ content }: { content: EventoVivoContent }) {
  return (
    <>
      <PhotoPanel
        span={8}
        media={content.media}
        eyebrow="Transmisión"
        title={content.title}
        sub={content.speaker}
        badge={<SigBadge kind="live">{content.badge}</SigBadge>}
      />
      <SigCard span={4}>
        <CardHead eyebrow="Programación" title="Desarrollo del acto" />
        <CardBody>
          <VerticalPager
            pageSize={4}
            items={content.schedule.map((s, i) => (
              <AgendaRow key={i} time={s.time} title={s.label} />
            ))}
          />
        </CardBody>
        {content.qrCaption && (
          <QrStrip label={content.qrCaption} url={content.qrUrl} />
        )}
      </SigCard>
    </>
  );
}

/** Vista 11 — Testimonios de egresados. */
export function TestimonioView({ content }: { content: TestimonioContent }) {
  return (
    <>
      <PhotoPanel
        span={7}
        media={content.media}
        eyebrow="Testimonio"
        title={content.quote ? `“${content.quote}”` : content.name}
        sub={content.program}
      />
      <SigCard span={5} center>
        <CardBody className="px-[34px] py-[32px]">
          <p
            className="font-serif font-bold leading-tight text-sig-ink"
            style={{ fontSize: T.cardTitle }}
          >
            {content.name}
          </p>
          {content.program && (
            <p className="mt-2 text-sig-text-soft" style={{ fontSize: T.meta }}>
              {content.program}
            </p>
          )}
          {content.result && (
            <p
              className="mt-6 line-clamp-4 leading-[1.45] text-sig-text-soft"
              style={{ fontSize: T.body }}
            >
              {content.result}
            </p>
          )}
          {content.strapline && (
            <div className="mt-6">
              <PullQuote size={17}>{content.strapline}</PullQuote>
            </div>
          )}
        </CardBody>
      </SigCard>
    </>
  );
}

/** Vista 12 — Mensaje institucional de una autoridad. */
export function MensajeView({ content }: { content: MensajeContent }) {
  return (
    <>
      <PhotoPanel
        span={6}
        media={content.media}
        eyebrow="Autoridad"
        title={content.name}
        sub={content.authority}
        flag={false}
      />
      <SigCard span={6} center>
        <CardBody className="px-[40px] py-[38px]">
          {content.quote && (
            <div className="line-clamp-5">
              <PullQuote size={23}>{content.quote}</PullQuote>
            </div>
          )}
          {content.message && (
            <p
              className="mt-7 line-clamp-4 leading-[1.45] text-sig-text-soft"
              style={{ fontSize: T.body }}
            >
              {content.message}
            </p>
          )}
        </CardBody>
        {content.qrCaption && (
          <QrStrip label={content.qrCaption} url={content.qrUrl} />
        )}
      </SigCard>
    </>
  );
}

/** Reexportado para compatibilidad con vistas que mostraban métricas. */
export { StatRow, NextStrip };
