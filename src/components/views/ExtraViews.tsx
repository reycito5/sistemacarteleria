import type {
  BienvenidaContent,
  ReconocimientosContent,
  EventoVivoContent,
  TestimonioContent,
  MensajeContent,
} from "@/lib/views/schemas";
import {
  DataPoint,
  Kicker,
  PosterLayout,
  RedBar,
  SplitLayout,
} from "@/components/signage/layouts";
import { QrCode } from "@/components/signage/QrCode";
import { T, LH, autoSize } from "@/components/signage/scale";

/**
 * Vista 7 — Bienvenida y orientación al visitante.
 *
 * Arquetipo PÓSTER: es la pantalla que da la cara al que entra al edificio,
 * así que la foto va a sangre y el saludo ocupa el ancho completo. Las
 * ubicaciones se apartan a una columna lateral translúcida para que orienten
 * sin robarle protagonismo a la bienvenida.
 */
export function BienvenidaView({ content }: { content: BienvenidaContent }) {
  const locations = content.locations.slice(0, 5);

  return (
    <PosterLayout
      media={content.media}
      kicker="Bienvenida"
      title={content.title}
      sub={content.subtitle || content.strapline}
      qrUrl={content.qrUrl || undefined}
      qrLabel={content.qrCaption}
      asideSpan={4}
      aside={
        locations.length > 0 ? (
          <>
            <Kicker onDark>Dónde encontrarnos</Kicker>
            {locations.map((l, i) => (
              <DataPoint key={i} label={l.label} value={l.place} onDark />
            ))}
          </>
        ) : undefined
      }
    />
  );
}

/**
 * Vista 9 — Reconocimientos académicos.
 *
 * Arquetipo PÓSTER: la persona reconocida es la protagonista y su nombre va a
 * tamaño de cartel. El resto de distinciones se lista al lado, numerado, para
 * que se lean como un palmarés y no como un párrafo.
 */
export function ReconocimientosView({
  content,
}: {
  content: ReconocimientosContent;
}) {
  const [featured, ...rest] = content.items;

  return (
    <PosterLayout
      media={content.media}
      kicker={featured?.role || "Reconocimiento académico"}
      title={featured?.name ?? content.title}
      sub={featured?.detail || content.strapline}
      badge={<RedBar>{content.badge}</RedBar>}
      asideSpan={4}
      aside={
        rest.length > 0 ? (
          <>
            <Kicker onDark>{content.title}</Kicker>
            {rest.map((r, i) => (
              <div key={i} className="flex items-start gap-5">
                <span
                  className="shrink-0 font-mono font-bold leading-none text-sig-red"
                  style={{ fontSize: T.cardTitle }}
                >
                  {String(i + 2).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p
                    className="font-serif font-bold leading-tight text-white"
                    style={{ fontSize: T.itemTitle }}
                  >
                    {r.name}
                  </p>
                  {(r.role || r.detail) && (
                    <p
                      className="mt-1.5 text-white/70"
                      style={{ fontSize: T.meta }}
                    >
                      {[r.role, r.detail].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : undefined
      }
    />
  );
}

/**
 * Vista 10 — Transmisión o evento en vivo.
 *
 * Arquetipo PÓSTER con el video a sangre: si hay transmisión, la imagen ES la
 * pantalla. El desarrollo del acto va en la columna lateral, con la hora en
 * mono para poder seguirlo de un vistazo.
 */
export function EventoVivoView({ content }: { content: EventoVivoContent }) {
  return (
    <PosterLayout
      media={content.media}
      kicker={content.speaker}
      title={content.title}
      badge={
        <span
          className="inline-flex items-center gap-3 bg-sig-red px-7 py-3 font-bold uppercase tracking-[.14em] text-white"
          style={{ fontSize: T.eyebrow }}
        >
          <span aria-hidden className="ui-pulse text-[16px] leading-none">
            ●
          </span>
          {content.badge}
        </span>
      }
      qrUrl={content.qrUrl || undefined}
      qrLabel={content.qrCaption}
      asideSpan={4}
      aside={
        content.schedule.length > 0 ? (
          <>
            <Kicker onDark>Desarrollo del acto</Kicker>
            {content.schedule.slice(0, 4).map((s, i) => (
              <div key={i} className="flex items-baseline gap-6">
                <span
                  className="w-[150px] shrink-0 font-mono font-bold text-sig-red"
                  style={{ fontSize: T.itemTitle }}
                >
                  {s.time}
                </span>
                <span
                  className="min-w-0 font-serif font-bold leading-tight text-white"
                  style={{ fontSize: T.itemTitle }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </>
        ) : undefined
      }
    />
  );
}

/**
 * Vista 11 — Testimonios de egresados.
 *
 * Arquetipo PÓSTER con la CITA como titular. Un testimonio convence por lo
 * que dice, no por quién lo dice: la frase va a tamaño de cartel y la firma
 * —nombre, programa, resultado— queda debajo, más pequeña.
 */
export function TestimonioView({ content }: { content: TestimonioContent }) {
  return (
    <PosterLayout
      media={content.media}
      kicker="Testimonio"
      title={content.quote ? `“${content.quote}”` : content.name}
      asideSpan={4}
    >
      <div className="mt-9 flex items-center gap-6 border-t-2 border-white/25 pt-7">
        <span aria-hidden className="h-[64px] w-[8px] shrink-0 bg-sig-red" />
        <div className="min-w-0">
          <p
            className="font-serif font-bold leading-tight text-white"
            style={{ fontSize: T.cardTitle }}
          >
            {content.name}
          </p>
          {(content.program || content.result) && (
            <p
              className="mt-2 text-white/75"
              style={{ fontSize: T.body, lineHeight: LH.body }}
            >
              {[content.program, content.result].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>
    </PosterLayout>
  );
}

/**
 * Vista 12 — Mensaje institucional de una autoridad.
 *
 * Arquetipo SPLIT MACIZO con el retrato a la DERECHA: el mensaje se lee sobre
 * azul lleno, sin marcos, y la fotografía cierra la composición. Es el
 * espejo del programa destacado, de modo que las dos pantallas nunca se
 * confunden aunque compartan estructura.
 */
export function MensajeView({ content }: { content: MensajeContent }) {
  return (
    <SplitLayout
      media={content.media}
      mediaSide="right"
      mediaSpan={5}
      solid
      stretch
      mediaOverlay={
        <>
          <Kicker onDark>{content.authority}</Kicker>
          <p
            className="mt-4 font-serif font-black text-white"
            style={{
              fontSize: T.headline,
              lineHeight: LH.headline,
              textShadow: "0 4px 40px rgba(0,0,0,.55)",
            }}
          >
            {content.name}
          </p>
        </>
      }
    >
      <div className="flex flex-1 flex-col justify-center px-[56px] py-[40px]">
        <Kicker onDark>Mensaje institucional</Kicker>

        {content.quote && (
          <blockquote
            className="mt-6 border-l-[10px] border-sig-red pl-9 font-serif font-bold italic text-white"
            style={{
              fontSize: autoSize(content.quote, T.hero, 44, 56),
              lineHeight: 1.08,
            }}
          >
            {content.quote}
          </blockquote>
        )}

        {content.message && (
          <p
            className="mt-7 line-clamp-3 max-w-[900px] font-medium text-white/80"
            style={{ fontSize: T.bodyLg, lineHeight: LH.body }}
          >
            {content.message}
          </p>
        )}

        {(content.qrUrl || content.qrCaption) && (
          <div className="mt-8 flex items-center gap-7 border-t border-white/20 pt-6">
            {content.qrUrl && (
              <div className="shrink-0 bg-white p-3">
                <QrCode value={content.qrUrl} size={96} />
              </div>
            )}
            <p
              className="font-serif font-bold leading-tight text-white"
              style={{ fontSize: T.itemTitle }}
            >
              {content.qrCaption}
            </p>
          </div>
        )}
      </div>
    </SplitLayout>
  );
}
