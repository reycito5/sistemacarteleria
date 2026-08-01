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
  Eyebrow,
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
import { AutoFitText } from "@/components/signage/AutoFitText";
import { LiveStreamMedia } from "@/components/signage/LiveStreamMedia";

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
  const eventDetails = [
    ["Fecha", content.dateLabel],
    ["Hora", content.timeLabel],
    ["Lugar", content.place],
  ].filter(([, value]) => Boolean(value));

  return (
    <>
      <div
        className="flex min-h-0 flex-col overflow-hidden bg-sig-ink-deep shadow-[0_24px_70px_rgba(8,20,64,.2)]"
        style={{ gridColumn: "span 8" }}
      >
        <div className="flex items-center justify-between border-b-4 border-sig-red bg-sig-ink px-7 py-4">
          <div className="flex items-center gap-4">
            <SigBadge kind="live">{content.badge}</SigBadge>
            <span className="font-mono text-[16px] font-bold uppercase tracking-[.16em] text-white/55">
              {content.eventType}
            </span>
          </div>
          <span className="font-mono text-[16px] font-bold uppercase tracking-[.12em] text-white/55">
            Señal institucional
          </span>
        </div>

        <div className="min-h-0 flex-1 bg-black">
          <LiveStreamMedia streamUrl={content.streamUrl} fallback={content.media} />
        </div>

        <div className="grid shrink-0 grid-cols-[1fr_auto] items-center gap-8 bg-sig-ink px-8 py-5 text-white">
          <div className="min-w-0">
            <AutoFitText
              as="h2"
              className="font-serif font-bold leading-[1.08]"
              maxSize={32}
              minSize={20}
              maxHeight={74}
            >
              {content.title}
            </AutoFitText>
            {content.speaker && (
              <AutoFitText
                className="mt-2 font-medium leading-[1.25] text-white/65"
                maxSize={20}
                minSize={14}
                maxHeight={48}
              >
                {content.speaker}
              </AutoFitText>
            )}
          </div>
          <div className="text-right font-mono text-[16px] font-bold uppercase tracking-[.12em] text-[#ff9da0]">
            Audio y video en directo
          </div>
        </div>
      </div>

      <SigCard span={4}>
        <CardHead eyebrow={content.eventType} title="Ficha del evento" />
        <CardBody>
          {eventDetails.length > 0 && (
            <div className="mb-5 grid gap-px bg-sig-rule">
              {eventDetails.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[92px_1fr] gap-4 bg-sig-card px-5 py-4">
                  <Eyebrow>{label}</Eyebrow>
                  <AutoFitText
                    className="font-serif font-bold leading-[1.15] text-sig-ink"
                    maxSize={22}
                    minSize={15}
                    maxHeight={54}
                  >
                    {value}
                  </AutoFitText>
                </div>
              ))}
            </div>
          )}
          {content.schedule.length > 0 ? (
            <VerticalPager
              pageSize={3}
              items={content.schedule.map((s, i) => (
                <AgendaRow key={i} time={s.time} title={s.label} />
              ))}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-center">
              <p className="max-w-[360px] text-[20px] leading-relaxed text-sig-text-soft">
                La transmisión está activa. Puede añadir momentos del programa desde el panel.
              </p>
            </div>
          )}
        </CardBody>
        {content.qrCaption && (
          <QrStrip label={content.qrCaption} url={content.qrUrl || content.streamUrl} />
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
            <AutoFitText
              className="mt-6 leading-[1.45] text-sig-text-soft"
              maxSize={T.body}
              minSize={16}
              maxHeight={220}
            >
              {content.result}
            </AutoFitText>
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
            <div>
              <PullQuote size={23}>{content.quote}</PullQuote>
            </div>
          )}
          {content.message && (
            <AutoFitText
              className="mt-7 leading-[1.45] text-sig-text-soft"
              maxSize={T.body}
              minSize={16}
              maxHeight={240}
            >
              {content.message}
            </AutoFitText>
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
