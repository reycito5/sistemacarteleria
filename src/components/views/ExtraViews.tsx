import type {
  BienvenidaContent,
  ReconocimientosContent,
  EventoVivoContent,
  TestimonioContent,
  MensajeContent,
} from "@/lib/views/schemas";
import { MediaPanel } from "./MediaPanel";
import { StrapLine } from "./ProgramacionGeneralView";

/** Vista 7 — Bienvenida y orientación. */
export function BienvenidaView({ content }: { content: BienvenidaContent }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1">
        <div className="w-[55%] p-3">
          <MediaPanel media={content.media} />
        </div>
        <div className="flex w-[45%] flex-col px-8 py-6">
          <h2 className="text-[46px] font-black uppercase leading-tight text-inst-blue-top">
            {content.title}
          </h2>
          {content.subtitle && (
            <p className="mt-2 text-[24px] font-medium text-panel-ink">
              {content.subtitle}
            </p>
          )}
          <ul className="mt-5 flex flex-1 flex-col justify-center gap-3">
            {content.locations.map((l, i) => (
              <li key={i} className="flex items-center gap-3 border-b pb-3" style={{ borderColor: "var(--color-panel-border)" }}>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md text-[20px]" style={{ color: "var(--color-inst-red)", border: "2px solid var(--color-inst-red)" }} aria-hidden>
                  ▸
                </span>
                <div>
                  <p className="text-[24px] font-extrabold text-inst-blue-top">{l.label}</p>
                  {l.place && <p className="text-[18px] text-panel-muted">{l.place}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {content.strapline && <StrapLine>{content.strapline}</StrapLine>}
    </div>
  );
}

/** Vista 9 — Reconocimientos. */
export function ReconocimientosView({ content }: { content: ReconocimientosContent }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-8 pt-4">
        <h2 className="text-[46px] font-black uppercase text-inst-blue-top">{content.title}</h2>
        <div className="mt-1 h-[3px] w-full" style={{ background: "var(--color-inst-gold)" }} />
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="w-[50%] p-3">
          <MediaPanel media={content.media} />
        </div>
        <div className="flex w-[50%] flex-col px-8 py-4">
          <div className="self-start">
            <span className="px-5 py-1.5 text-[20px] font-bold text-inst-white" style={{ background: "var(--color-inst-red)" }}>
              {content.badge}
            </span>
          </div>
          <ul className="mt-4 flex flex-col gap-4">
            {content.items.map((it, i) => (
              <li key={i} className="border-b pb-3" style={{ borderColor: "var(--color-panel-border)" }}>
                <p className="text-[28px] font-extrabold leading-tight text-inst-blue-top">{it.name}</p>
                {it.role && <p className="text-[20px] font-semibold text-inst-red">{it.role}</p>}
                {it.detail && <p className="text-[18px] text-panel-ink">{it.detail}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {content.strapline && <StrapLine>{content.strapline}</StrapLine>}
    </div>
  );
}

/** Vista 10 — Transmisión o evento en vivo. */
export function EventoVivoView({ content }: { content: EventoVivoContent }) {
  return (
    <div className="flex h-full">
      <div className="w-[60%] p-3">
        <MediaPanel media={content.media} />
      </div>
      <div className="flex w-[40%] flex-col px-8 py-6">
        <div className="self-start">
          <span className="flex items-center gap-2 px-5 py-1.5 text-[22px] font-black text-inst-white" style={{ background: "var(--color-inst-red)" }}>
            <span className="h-3 w-3 animate-pulse rounded-full bg-white" /> {content.badge}
          </span>
        </div>
        <h2 className="mt-4 text-[46px] font-black uppercase leading-[0.95] text-inst-blue-top">
          {content.title}
        </h2>
        {content.speaker && (
          <p className="mt-2 text-[24px] font-semibold text-inst-red">{content.speaker}</p>
        )}
        <ul className="mt-5 flex-1 space-y-2">
          {content.schedule.map((s, i) => (
            <li key={i} className="flex items-center gap-3 text-[22px]">
              <span className="font-mono font-bold text-inst-blue-top">{s.time}</span>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center gap-4">
          <div className="grid h-28 w-28 place-items-center bg-inst-white text-[12px] font-bold text-inst-blue-bottom" style={{ border: "3px solid var(--color-inst-blue-bottom)" }}>
            QR
          </div>
          <p className="text-[22px] font-extrabold text-inst-blue-top">{content.qrCaption}</p>
        </div>
      </div>
    </div>
  );
}

/** Vista 11 — Testimonios. */
export function TestimonioView({ content }: { content: TestimonioContent }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1">
        <div className="w-[58%] p-3">
          <MediaPanel media={content.media} />
        </div>
        <div className="flex w-[42%] flex-col justify-center px-8 py-6">
          {content.quote && (
            <p className="text-[34px] font-black italic leading-tight text-inst-blue-top">
              “{content.quote}”
            </p>
          )}
          <p className="mt-6 text-[30px] font-extrabold text-inst-blue-top">{content.name}</p>
          {content.program && (
            <p className="text-[22px] font-semibold text-inst-red">{content.program}</p>
          )}
          {content.result && (
            <p className="mt-3 text-[20px] text-panel-ink">{content.result}</p>
          )}
        </div>
      </div>
      {content.strapline && <StrapLine>{content.strapline}</StrapLine>}
    </div>
  );
}

/** Vista 12 — Mensaje institucional. */
export function MensajeView({ content }: { content: MensajeContent }) {
  return (
    <div className="flex h-full">
      <div className="w-[42%] p-3">
        <MediaPanel media={content.media} showControls={false} />
      </div>
      <div className="flex w-[58%] flex-col justify-center px-10 py-8">
        <p className="text-[22px] font-semibold uppercase tracking-wide text-inst-red">
          {content.authority}
        </p>
        <p className="text-[34px] font-black text-inst-blue-top">{content.name}</p>
        <div className="mt-3 h-[3px] w-28" style={{ background: "var(--color-inst-gold)" }} />
        {content.message && (
          <p className="mt-5 text-[24px] leading-relaxed text-panel-ink">{content.message}</p>
        )}
        {content.quote && (
          <p className="mt-6 text-[28px] font-black italic leading-tight text-inst-blue-top">
            “{content.quote}”
          </p>
        )}
      </div>
    </div>
  );
}
