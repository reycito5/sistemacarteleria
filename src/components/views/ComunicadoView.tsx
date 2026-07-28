import type { ComunicadoContent } from "@/lib/views/schemas";
import { EditorialLayout, Kicker, RedBar } from "@/components/signage/layouts";
import { QrCode } from "@/components/signage/QrCode";
import { T, LH } from "@/components/signage/scale";

/**
 * Vista 5 — Comunicado importante.
 *
 * Arquetipo EDITORIAL: el titular manda y todo lo demás lo acompaña. Un
 * comunicado tiene UNA idea —una fecha límite, un cambio de horario— así que
 * el dato decisivo va en rojo y a tamaño de cifra, no escondido en el cuerpo
 * del texto. La foto es opcional: si no hay, el texto ocupa el lienzo entero.
 */
export function ComunicadoView({ content }: { content: ComunicadoContent }) {
  return (
    <EditorialLayout
      kicker={<RedBar>{content.badge}</RedBar>}
      title={content.title}
      lead={content.subtitle || undefined}
      highlight={content.highlight || undefined}
      media={content.media}
      mediaSpan={4}
      mediaOverlay={
        content.mediaTitle || content.mediaSub || content.mediaEyebrow ? (
          <>
            {content.mediaEyebrow && <Kicker onDark>{content.mediaEyebrow}</Kicker>}
            {content.mediaTitle && (
              <p
                className="mt-3 font-serif font-bold leading-tight text-white"
                style={{ fontSize: T.cardTitle }}
              >
                {content.mediaTitle}
              </p>
            )}
            {content.mediaSub && (
              <p className="mt-2 text-white/80" style={{ fontSize: T.body }}>
                {content.mediaSub}
              </p>
            )}
          </>
        ) : undefined
      }
      footer={
        content.qrUrl || content.qrCaption ? (
          <div className="mt-8 flex items-center gap-6 border-t-2 border-sig-ink pt-6">
            {content.qrUrl && (
              <div className="shrink-0 border-2 border-sig-rule bg-white p-2">
                <QrCode value={content.qrUrl} size={112} />
              </div>
            )}
            {content.qrCaption && (
              <p
                className="font-serif font-bold leading-tight text-sig-ink"
                style={{ fontSize: T.itemTitle }}
              >
                {content.qrCaption}
              </p>
            )}
          </div>
        ) : undefined
      }
    >
      {content.body && (
        <p
          className="mt-6 max-w-[1200px] text-sig-text-soft"
          style={{ fontSize: T.body, lineHeight: LH.body }}
        >
          {content.body}
        </p>
      )}

      {content.specs.length > 0 && (
        <div className="mt-8 grid grid-cols-3 gap-px border-y border-sig-rule bg-sig-rule">
          {content.specs.slice(0, 6).map((s, i) => (
            <div key={`${s.label}-${i}`} className="bg-sig-card px-7 py-6">
              <p
                className="font-bold uppercase tracking-[.14em] text-sig-text-faint"
                style={{ fontSize: 20 }}
              >
                {s.label}
              </p>
              <p
                className="mt-2 font-serif font-bold leading-tight text-sig-ink"
                style={{ fontSize: T.itemTitle }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </EditorialLayout>
  );
}
